/**
 * EcoRoute AI - Route Optimization Module
 * 
 * Goal: Find the best garbage pickup route based on priorities, capacity, and distance.
 */

// Mock distance function for demonstration.
// In a real application, use Google Maps API, OSRM, or Haversine formula with lat/lng.
const calculateDistance = (loc1, loc2) => {
  if (loc1 === loc2) return 0;
  // Deterministic mock distance between 1 and 15 km based on string lengths
  const seed = (loc1.length + loc2.length) % 15;
  return seed === 0 ? 1 : seed;
};

/**
 * Standardize and score all stops (requests and bins).
 * 
 * Priorities:
 * 3 = OVERFLOW (Bin) or HIGH (Request)
 * 2 = CRITICAL (Bin) or MEDIUM (Request)
 * 1 = WARNING (Bin) or LOW (Request)
 */
const prepareStops = (requests, bins) => {
  const stops = [];

  // Parse pending requests
  requests.forEach(req => {
    if (req.status !== 'completed' && req.status !== 'cancelled') {
      let score = 1;
      if (req.priority === 'High') score = 3;
      else if (req.priority === 'Medium') score = 2;

      stops.push({
        id: req.requestId || req._id?.toString(),
        type: 'Request',
        location: req.location,
        wasteAmount: req.wasteAmount || 0,
        wasteType: req.wasteType,
        priorityScore: score,
        originalData: req
      });
    }
  });

  // Parse smart bins
  bins.forEach(bin => {
    // Only optimize routes for bins that actually need pickup
    if (bin.status !== 'normal') {
      let score = 1; // warning
      if (bin.status === 'overflow') score = 3;
      else if (bin.status === 'critical') score = 2;

      // Estimate waste amount based on fill level and capacity if needed.
      // For this module, we assume a standard bin adds roughly 50kg when full.
      const estimatedWeight = (bin.fillLevel / 100) * 50; 

      stops.push({
        id: bin.binId || bin._id?.toString(),
        type: 'Bin',
        location: bin.location,
        wasteAmount: estimatedWeight,
        wasteType: 'Mixed', // Defaulting for bins
        priorityScore: score,
        originalData: bin
      });
    }
  });

  return stops;
};

/**
 * Main optimization logic
 * 
 * @param {Array} pendingRequests - List of request objects
 * @param {Array} smartBins - List of smart bin objects
 * @param {Object} truck - Truck object containing { truckId, capacity, currentLoad, location }
 * @returns {Object} Optimized route result
 */
const optimizeRoute = (pendingRequests, smartBins, truck) => {
  const allStops = prepareStops(pendingRequests, smartBins);
  
  const routeStops = [];
  const remainingStops = [];
  let currentLoad = truck.currentLoad || 0;
  const capacity = truck.capacity || 5000; // Default 5000kg (5t)
  let currentLocation = truck.location || 'Depot';

  // Group stops by priority tier: 3 (High), 2 (Medium), 1 (Low)
  const priorityGroups = {
    3: allStops.filter(s => s.priorityScore === 3),
    2: allStops.filter(s => s.priorityScore === 2),
    1: allStops.filter(s => s.priorityScore === 1)
  };

  // Logic: Go through priority 3, then 2, then 1.
  for (let p = 3; p >= 1; p--) {
    let tierStops = [...priorityGroups[p]];

    while (tierStops.length > 0) {
      // Find the nearest stop in the current priority tier
      let nearestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < tierStops.length; i++) {
        const dist = calculateDistance(currentLocation, tierStops[i].location);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIndex = i;
        }
      }

      const nextStop = tierStops[nearestIndex];

      // Check capacity
      if (currentLoad + nextStop.wasteAmount <= capacity) {
        // Add to route
        routeStops.push({
          ...nextStop,
          distanceFromLastStop: minDistance
        });
        
        // Update truck state
        currentLoad += nextStop.wasteAmount;
        currentLocation = nextStop.location;
        
        // Remove from available tier stops
        tierStops.splice(nearestIndex, 1);
      } else {
        // Truck is full or can't fit this specific stop.
        // We move it to remaining requests.
        remainingStops.push(tierStops.splice(nearestIndex, 1)[0]);
      }
    }
  }

  return {
    truckId: truck.truckId,
    optimizedRoute: true,
    totalStops: routeStops.length,
    orderedStops: routeStops,
    totalLoad: parseFloat(currentLoad.toFixed(2)),
    capacityUtilized: `${((currentLoad / capacity) * 100).toFixed(1)}%`,
    remainingRequests: remainingStops.length
  };
};

module.exports = {
  optimizeRoute,
  calculateDistance,
  prepareStops
};
