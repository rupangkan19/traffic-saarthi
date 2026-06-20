import type { Incident } from '../types';

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'TSID00001',
    cause: 'accident',
    corridor: 'Silk Board Junction',
    junction: 'Silk Board Junction',
    address: 'Silk Board Junction, Hosur Road, Bengaluru - 560068',
    lat: 12.9172, lng: 77.6230,
    priority: 'High', status: 'active', requiresRoadClosure: true,
    vehicleType: 'Car', vehicleNumber: 'KA01AB1234',
    description: 'Multi-vehicle collision blocking 3 lanes. Ambulance dispatched.',
    direction: 'North to South',
    timeOfIncident: '2024-03-15T08:30:00',
    createdAt: '2024-03-15T08:35:00', updatedAt: '2024-03-15T09:00:00',
    impactScore: 95, impactLevel: 'High',
    officerNotes: [
      { text: 'Tow truck called. Lane partially cleared.', timestamp: '2024-03-15T08:50:00', author: 'SI Ramesh' }
    ]
  },
  {
    id: 'TSID00002',
    cause: 'vip_movement',
    corridor: 'CBD 1',
    junction: 'Richmond Circle',
    address: 'Residency Road, Richmond Circle, Bengaluru - 560025',
    lat: 12.9716, lng: 77.6099,
    priority: 'High', status: 'active', requiresRoadClosure: true,
    description: 'Chief Minister convoy movement. Road sealed for 2 hours.',
    direction: 'East to West',
    timeOfIncident: '2024-04-02T10:00:00',
    createdAt: '2024-04-02T09:45:00', updatedAt: '2024-04-02T10:30:00',
    impactScore: 88, impactLevel: 'High',
    officerNotes: [
      { text: 'Diversion via MG Road activated.', timestamp: '2024-04-02T10:05:00', author: 'Insp. Kumar' }
    ]
  },
  {
    id: 'TSID00003',
    cause: 'water_logging',
    corridor: 'Hosur Road',
    junction: 'Electronic City Toll',
    address: 'Electronic City Phase 1, Hosur Road, Bengaluru - 560100',
    lat: 12.8456, lng: 77.6603,
    priority: 'High', status: 'active', requiresRoadClosure: false,
    vehicleType: 'Truck',
    description: 'Heavy waterlogging after rain. Slow moving traffic, 2km backup.',
    direction: 'Both directions',
    timeOfIncident: '2024-01-22T17:45:00',
    createdAt: '2024-01-22T18:00:00', updatedAt: '2024-01-22T18:30:00',
    impactScore: 80, impactLevel: 'High',
    officerNotes: []
  },
  {
    id: 'TSID00004',
    cause: 'vehicle_breakdown',
    corridor: 'ORR East 1',
    junction: 'Marathahalli Bridge',
    address: 'Marathahalli Bridge, Outer Ring Road, Bengaluru - 560037',
    lat: 12.9591, lng: 77.6991,
    priority: 'High', status: 'active', requiresRoadClosure: false,
    vehicleType: 'Bus', vehicleNumber: 'KA57F9876', breakdownReason: 'Engine failure',
    description: 'BMTC bus stalled on bridge blocking right lane.',
    direction: 'Towards Silk Board',
    timeOfIncident: '2024-02-28T08:15:00',
    createdAt: '2024-02-28T08:20:00', updatedAt: '2024-02-28T08:45:00',
    impactScore: 82, impactLevel: 'High',
    officerNotes: [
      { text: 'Bus pushed to shoulder. Traffic normalized.', timestamp: '2024-02-28T09:00:00', author: 'HC Suresh' }
    ]
  },
  {
    id: 'TSID00005',
    cause: 'construction',
    corridor: 'Mysore Road',
    junction: 'Mysore Road NICE Junction',
    address: 'Kengeri, Mysore Road, Bengaluru - 560060',
    lat: 12.9044, lng: 77.5287,
    priority: 'Medium', status: 'active', requiresRoadClosure: true,
    description: 'Metro construction blocking service road. Traffic diverted via parallel road.',
    direction: 'Both directions',
    timeOfIncident: '2023-11-05T06:00:00',
    createdAt: '2023-11-05T06:00:00', updatedAt: '2024-03-01T06:00:00',
    impactScore: 75, impactLevel: 'Medium',
    officerNotes: [
      { text: 'Signs placed 500m before site.', timestamp: '2023-11-05T06:30:00', author: 'Insp. Priya' }
    ]
  },
  {
    id: 'TSID00006',
    cause: 'accident',
    corridor: 'Bellary Road 1',
    junction: 'Hebbal Flyover',
    address: 'Hebbal Flyover, Bellary Road, Bengaluru - 560024',
    lat: 13.0358, lng: 77.5970,
    priority: 'High', status: 'resolved', requiresRoadClosure: true,
    vehicleType: 'Car', vehicleNumber: 'KA03MN5678',
    description: 'Two-vehicle collision on flyover. One injured, taken to hospital.',
    direction: 'Airport direction',
    timeOfIncident: '2023-12-10T07:30:00',
    createdAt: '2023-12-10T07:35:00', updatedAt: '2023-12-10T09:00:00',
    resolvedAt: '2023-12-10T09:00:00', resolutionTimeMin: 85,
    impactScore: 90, impactLevel: 'High',
    officerNotes: [
      { text: 'Wreckage cleared. Both lanes open.', timestamp: '2023-12-10T08:55:00', author: 'SI Rajan' }
    ]
  },
  {
    id: 'TSID00007',
    cause: 'tree_fall',
    corridor: 'Bannerghatta Road',
    junction: 'Jayanagar 4th Block',
    address: 'Bannerghatta Road, near JP Nagar 3rd Phase, Bengaluru - 560078',
    lat: 12.8933, lng: 77.5985,
    priority: 'High', status: 'resolved', requiresRoadClosure: true,
    description: 'Large tree fell across road during storm. Road completely blocked.',
    direction: 'Both directions',
    timeOfIncident: '2024-01-08T14:20:00',
    createdAt: '2024-01-08T14:25:00', updatedAt: '2024-01-08T16:00:00',
    resolvedAt: '2024-01-08T16:00:00', resolutionTimeMin: 95,
    impactScore: 85, impactLevel: 'High',
    officerNotes: [
      { text: 'BBMP team cleared tree. Road open.', timestamp: '2024-01-08T15:55:00', author: 'HC Lakshmi' }
    ]
  },
  {
    id: 'TSID00008',
    cause: 'public_event',
    corridor: 'CBD 2',
    junction: 'Mayo Hall Junction',
    address: 'MG Road, Brigade Road Junction, Bengaluru - 560001',
    lat: 12.9757, lng: 77.6083,
    priority: 'High', status: 'resolved', requiresRoadClosure: false,
    description: 'New Year celebrations. Large crowds on MG Road causing gridlock.',
    direction: 'All directions',
    timeOfIncident: '2024-01-01T20:00:00',
    createdAt: '2024-01-01T20:00:00', updatedAt: '2024-01-02T01:00:00',
    resolvedAt: '2024-01-02T01:00:00', resolutionTimeMin: 300,
    impactScore: 82, impactLevel: 'High',
    officerNotes: [
      { text: '50 officers deployed. Situation controlled by midnight.', timestamp: '2024-01-01T23:00:00', author: 'DCP Traffic' }
    ]
  },
  {
    id: 'TSID00009',
    cause: 'vehicle_breakdown',
    corridor: 'Tumkur Road',
    junction: 'Peenya Junction',
    address: 'Peenya Industrial Area, Tumkur Road, Bengaluru - 560058',
    lat: 13.0284, lng: 77.5183,
    priority: 'Medium', status: 'resolved', requiresRoadClosure: false,
    vehicleType: 'Truck', vehicleNumber: 'KA14C2345', breakdownReason: 'Tyre puncture',
    description: 'Heavy goods vehicle with punctured tyre blocking left lane.',
    direction: 'Towards city',
    timeOfIncident: '2023-11-18T09:45:00',
    createdAt: '2023-11-18T09:50:00', updatedAt: '2023-11-18T10:30:00',
    resolvedAt: '2023-11-18T10:30:00', resolutionTimeMin: 40,
    impactScore: 60, impactLevel: 'Medium',
    officerNotes: []
  },
  {
    id: 'TSID00010',
    cause: 'pot_holes',
    corridor: 'Whitefield Road',
    junction: 'Whitefield Signal',
    address: 'Whitefield Main Road, near ITPL, Bengaluru - 560066',
    lat: 12.9800, lng: 77.7352,
    priority: 'Medium', status: 'resolved', requiresRoadClosure: false,
    description: 'Large pothole after rain causing vehicles to slow. Minor accidents reported.',
    direction: 'Both directions',
    timeOfIncident: '2023-12-20T11:00:00',
    createdAt: '2023-12-20T11:05:00', updatedAt: '2023-12-21T14:00:00',
    resolvedAt: '2023-12-21T14:00:00', resolutionTimeMin: 1620,
    impactScore: 45, impactLevel: 'Low',
    officerNotes: [
      { text: 'BBMP notified. Temporary patching done.', timestamp: '2023-12-20T15:00:00', author: 'SI Anand' }
    ]
  },
  {
    id: 'TSID00011',
    cause: 'accident',
    corridor: 'Old Madras Road',
    junction: 'KR Puram Bridge',
    address: 'KR Puram Bridge, Old Madras Road, Bengaluru - 560036',
    lat: 13.0027, lng: 77.6946,
    priority: 'High', status: 'resolved', requiresRoadClosure: true,
    vehicleType: 'Motorcycle', vehicleNumber: 'KA04HJ7890',
    description: 'Bike-truck collision on bridge. Biker injured seriously.',
    direction: 'Towards city',
    timeOfIncident: '2024-02-05T07:00:00',
    createdAt: '2024-02-05T07:05:00', updatedAt: '2024-02-05T08:30:00',
    resolvedAt: '2024-02-05T08:30:00', resolutionTimeMin: 85,
    impactScore: 92, impactLevel: 'High',
    officerNotes: [
      { text: 'Ambulance reached in 12 min. Victim stable.', timestamp: '2024-02-05T07:20:00', author: 'Insp. Nair' }
    ]
  },
  {
    id: 'TSID00012',
    cause: 'construction',
    corridor: 'Airport Road',
    junction: 'Hebbal Flyover',
    address: 'Airport Road, near Mekhri Circle, Bengaluru - 560080',
    lat: 13.0113, lng: 77.5836,
    priority: 'Medium', status: 'resolved', requiresRoadClosure: false,
    description: 'Utility work by BWSSB causing lane reduction.',
    direction: 'Airport bound',
    timeOfIncident: '2023-11-28T10:00:00',
    createdAt: '2023-11-28T10:00:00', updatedAt: '2023-11-29T18:00:00',
    resolvedAt: '2023-11-29T18:00:00', resolutionTimeMin: 1920,
    impactScore: 62, impactLevel: 'Medium',
    officerNotes: []
  },
  {
    id: 'TSID00013',
    cause: 'vehicle_breakdown',
    corridor: 'Electronic City',
    junction: 'Electronic City Toll',
    address: 'Electronic City Flyover, Hosur Road, Bengaluru - 560100',
    lat: 12.8393, lng: 77.6734,
    priority: 'Low', status: 'closed', requiresRoadClosure: false,
    description: 'Car stalled near toll booth. Pushed to shoulder within 15 minutes.',
    direction: 'Outbound',
    timeOfIncident: '2023-12-05T19:30:00',
    createdAt: '2023-12-05T19:32:00', updatedAt: '2023-12-05T19:50:00',
    resolvedAt: '2023-12-05T19:50:00', resolutionTimeMin: 18,
    impactScore: 38, impactLevel: 'Low',
    officerNotes: []
  },
  {
    id: 'TSID00014',
    cause: 'accident',
    corridor: 'ORR East 2',
    junction: 'Varthur Junction',
    address: 'Varthur Junction, Outer Ring Road, Bengaluru - 560087',
    lat: 12.9354, lng: 77.7360,
    priority: 'High', status: 'closed', requiresRoadClosure: true,
    vehicleType: 'Auto', vehicleNumber: 'KA51AB3456',
    description: 'Three-vehicle pile-up. Two persons injured. Road closed for 90 minutes.',
    direction: 'Towards Marathahalli',
    timeOfIncident: '2024-01-15T17:45:00',
    createdAt: '2024-01-15T17:50:00', updatedAt: '2024-01-15T19:30:00',
    resolvedAt: '2024-01-15T19:30:00', resolutionTimeMin: 100,
    impactScore: 91, impactLevel: 'High',
    officerNotes: [
      { text: 'Case filed. Vehicles towed to yard.', timestamp: '2024-01-15T19:25:00', author: 'SI Verma' }
    ]
  },
  {
    id: 'TSID00015',
    cause: 'pot_holes',
    corridor: 'Sarjapur Road',
    junction: 'Bellandur Junction',
    address: 'Bellandur, Sarjapur Road, Bengaluru - 560103',
    lat: 12.9254, lng: 77.6755,
    priority: 'Low', status: 'closed', requiresRoadClosure: false,
    description: 'Multiple potholes reported after rains. Slow traffic advisory issued.',
    direction: 'Both directions',
    timeOfIncident: '2023-11-10T12:00:00',
    createdAt: '2023-11-10T12:00:00', updatedAt: '2023-11-12T10:00:00',
    resolvedAt: '2023-11-12T10:00:00', resolutionTimeMin: 2760,
    impactScore: 35, impactLevel: 'Low',
    officerNotes: []
  },
  {
    id: 'TSID00016',
    cause: 'public_event',
    corridor: 'Kanakapura Road',
    junction: 'Banashankari Circle',
    address: 'Banashankari Temple Road, Bengaluru - 560070',
    lat: 12.9256, lng: 77.5591,
    priority: 'Medium', status: 'closed', requiresRoadClosure: false,
    description: 'Banashankari Devi Jatre festival. Large crowds near temple.',
    direction: 'Inbound',
    timeOfIncident: '2024-02-18T16:00:00',
    createdAt: '2024-02-18T16:00:00', updatedAt: '2024-02-18T22:00:00',
    resolvedAt: '2024-02-18T22:00:00', resolutionTimeMin: 360,
    impactScore: 68, impactLevel: 'Medium',
    officerNotes: [
      { text: 'Event concluded peacefully. Traffic normalized.', timestamp: '2024-02-18T21:45:00', author: 'HC Meena' }
    ]
  },
  {
    id: 'TSID00017',
    cause: 'water_logging',
    corridor: 'Hennur Road',
    junction: 'Nagawara Junction',
    address: 'Hennur Main Road, near Nagawara, Bengaluru - 560045',
    lat: 13.0386, lng: 77.6489,
    priority: 'Medium', status: 'closed', requiresRoadClosure: false,
    description: 'Underpass flooded after heavy rain. Traffic re-routed.',
    direction: 'Both directions',
    timeOfIncident: '2023-11-30T15:30:00',
    createdAt: '2023-11-30T15:35:00', updatedAt: '2023-11-30T20:00:00',
    resolvedAt: '2023-11-30T20:00:00', resolutionTimeMin: 265,
    impactScore: 65, impactLevel: 'Medium',
    officerNotes: []
  },
  {
    id: 'TSID00018',
    cause: 'vehicle_breakdown',
    corridor: 'West of Chord Road',
    junction: 'Yeshwanthpur Circle',
    address: 'Yeshwanthpur Circle, Tumkur Road, Bengaluru - 560022',
    lat: 13.0204, lng: 77.5506,
    priority: 'Low', status: 'closed', requiresRoadClosure: false,
    vehicleType: 'Car', vehicleNumber: 'KA19BB9999',
    breakdownReason: 'Battery dead',
    description: 'Private car stalled at signal. Pushed to side quickly.',
    direction: 'Towards Rajajinagar',
    timeOfIncident: '2024-03-01T11:20:00',
    createdAt: '2024-03-01T11:22:00', updatedAt: '2024-03-01T11:40:00',
    resolvedAt: '2024-03-01T11:40:00', resolutionTimeMin: 18,
    impactScore: 32, impactLevel: 'Low',
    officerNotes: []
  },
  {
    id: 'TSID00019',
    cause: 'accident',
    corridor: 'ORR North 1',
    junction: 'Manyata Tech Park Junction',
    address: 'Nagawara, ORR North, Bengaluru - 560045',
    lat: 13.0455, lng: 77.6199,
    priority: 'High', status: 'closed', requiresRoadClosure: true,
    vehicleType: 'Truck',
    description: 'Truck overturned. Diesel spill requiring cleanup.',
    direction: 'Outbound',
    timeOfIncident: '2024-01-29T06:45:00',
    createdAt: '2024-01-29T06:50:00', updatedAt: '2024-01-29T10:00:00',
    resolvedAt: '2024-01-29T10:00:00', resolutionTimeMin: 190,
    impactScore: 90, impactLevel: 'High',
    officerNotes: [
      { text: 'Fire dept called for spill. Road clear at 10am.', timestamp: '2024-01-29T09:55:00', author: 'Insp. Reddy' }
    ]
  },
  {
    id: 'TSID00020',
    cause: 'construction',
    corridor: 'Bellary Road 2',
    junction: 'Nagawara Junction',
    address: 'Bellary Road, near Yelahanka, Bengaluru - 560064',
    lat: 13.0997, lng: 77.5900,
    priority: 'Low', status: 'closed', requiresRoadClosure: false,
    description: 'Road widening work. One lane operational. Slow traffic.',
    direction: 'Both directions',
    timeOfIncident: '2023-12-01T08:00:00',
    createdAt: '2023-12-01T08:00:00', updatedAt: '2024-01-15T18:00:00',
    resolvedAt: '2024-01-15T18:00:00', resolutionTimeMin: 68760,
    impactScore: 52, impactLevel: 'Medium',
    officerNotes: []
  },
  {
    id: 'TSID00021',
    cause: 'others',
    corridor: 'Non-corridor',
    junction: 'Shivajinagar Bus Stand',
    address: 'Shivajinagar Bus Stand, Bengaluru - 560001',
    lat: 12.9848, lng: 77.6045,
    priority: 'Low', status: 'closed', requiresRoadClosure: false,
    description: 'Passenger fight caused brief commotion. Police intervened.',
    direction: 'N/A',
    timeOfIncident: '2024-02-10T13:00:00',
    createdAt: '2024-02-10T13:05:00', updatedAt: '2024-02-10T13:30:00',
    resolvedAt: '2024-02-10T13:30:00', resolutionTimeMin: 25,
    impactScore: 28, impactLevel: 'Low',
    officerNotes: []
  },
  {
    id: 'TSID00022',
    cause: 'vip_movement',
    corridor: 'Airport Road',
    junction: 'Hebbal Flyover',
    address: 'Bellary Road, Hebbal, Bengaluru - 560024',
    lat: 13.0350, lng: 77.5975,
    priority: 'High', status: 'closed', requiresRoadClosure: true,
    description: 'Prime Minister convoy en route to airport. Road sealed.',
    direction: 'Airport bound',
    timeOfIncident: '2024-03-20T09:00:00',
    createdAt: '2024-03-20T08:45:00', updatedAt: '2024-03-20T10:30:00',
    resolvedAt: '2024-03-20T10:30:00', resolutionTimeMin: 105,
    impactScore: 88, impactLevel: 'High',
    officerNotes: [
      { text: 'SPG coordination complete. Convoy passed safely.', timestamp: '2024-03-20T10:25:00', author: 'DCP North' }
    ]
  },
  {
    id: 'TSID00023',
    cause: 'tree_fall',
    corridor: 'Kanakapura Road',
    junction: 'Banashankari Circle',
    address: 'Kanakapura Road, near Dollars Colony, Bengaluru - 560076',
    lat: 12.9015, lng: 77.5666,
    priority: 'Medium', status: 'closed', requiresRoadClosure: true,
    description: 'Old tree uprooted during storm, blocking road entirely.',
    direction: 'Both directions',
    timeOfIncident: '2024-01-05T16:00:00',
    createdAt: '2024-01-05T16:05:00', updatedAt: '2024-01-05T18:30:00',
    resolvedAt: '2024-01-05T18:30:00', resolutionTimeMin: 145,
    impactScore: 71, impactLevel: 'Medium',
    officerNotes: []
  },
  {
    id: 'TSID00024',
    cause: 'pot_holes',
    corridor: 'ORR West 1',
    junction: 'Hoodi Junction',
    address: 'ORR, near Hoodi Junction, Bengaluru - 560048',
    lat: 12.9900, lng: 77.6980,
    priority: 'Low', status: 'closed', requiresRoadClosure: false,
    description: 'Deep pothole causing tyre damage to multiple vehicles.',
    direction: 'Towards Electronic City',
    timeOfIncident: '2024-02-14T10:00:00',
    createdAt: '2024-02-14T10:05:00', updatedAt: '2024-02-15T12:00:00',
    resolvedAt: '2024-02-15T12:00:00', resolutionTimeMin: 1555,
    impactScore: 38, impactLevel: 'Low',
    officerNotes: [
      { text: 'BBMP alerted. Temporary repair done next day.', timestamp: '2024-02-14T14:00:00', author: 'HC Vijay' }
    ]
  },
  {
    id: 'TSID00025',
    cause: 'vehicle_breakdown',
    corridor: 'ORR North 2',
    junction: 'Tin Factory',
    address: 'Tin Factory, Old Madras Road, Bengaluru - 560049',
    lat: 12.9992, lng: 77.6629,
    priority: 'Low', status: 'draft', requiresRoadClosure: false,
    description: 'Auto-rickshaw breakdown near junction. Driver seeking help.',
    direction: 'Towards KR Puram',
    timeOfIncident: '2024-04-01T14:00:00',
    createdAt: '2024-04-01T14:02:00', updatedAt: '2024-04-01T14:02:00',
    impactScore: 28, impactLevel: 'Low',
    officerNotes: []
  },
  { id:'TSID00026', cause:'accident', corridor:'Hosur Road', junction:'Silk Board Junction', address:'Silk Board, Hosur Road, Bengaluru', lat:12.9173, lng:77.6228, priority:'High', status:'resolved', requiresRoadClosure:true, vehicleType:'Car', description:'Rear-end collision during peak hours, 2 lanes blocked.', direction:'Towards Electronic City', timeOfIncident:'2023-11-02T08:10:00', createdAt:'2023-11-02T08:15:00', updatedAt:'2023-11-02T09:30:00', resolvedAt:'2023-11-02T09:30:00', resolutionTimeMin:75, impactScore:91, impactLevel:'High', officerNotes:[] },
  { id:'TSID00027', cause:'vehicle_breakdown', corridor:'Bellary Road 1', junction:'Mekhri Circle', address:'Bellary Road, Mekhri Circle, Bengaluru', lat:13.0028, lng:77.5801, priority:'Medium', status:'closed', requiresRoadClosure:false, vehicleType:'Bus', breakdownReason:'Brake failure', description:'BMTC bus breakdown at circle, minor congestion.', direction:'Towards Hebbal', timeOfIncident:'2023-11-05T07:30:00', createdAt:'2023-11-05T07:35:00', updatedAt:'2023-11-05T08:20:00', resolvedAt:'2023-11-05T08:20:00', resolutionTimeMin:45, impactScore:58, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00028', cause:'construction', corridor:'ORR East 1', junction:'Marathahalli Bridge', address:'ORR East, Marathahalli, Bengaluru', lat:12.9561, lng:77.7010, priority:'High', status:'active', requiresRoadClosure:true, description:'Road widening work — single lane operational on bridge.', direction:'Both directions', timeOfIncident:'2023-11-10T06:00:00', createdAt:'2023-11-10T06:00:00', updatedAt:'2024-04-01T06:00:00', impactScore:85, impactLevel:'High', officerNotes:[{text:'Contractor briefed. Work to continue till April.',timestamp:'2023-11-10T08:00:00',author:'Admin'}] },
  { id:'TSID00029', cause:'water_logging', corridor:'Hosur Road', junction:'BTM Layout Signal', address:'Hosur Road, BTM Layout, Bengaluru', lat:12.9166, lng:77.6175, priority:'High', status:'closed', requiresRoadClosure:true, description:'Underpass flooded after heavy overnight rain.', direction:'Both directions', timeOfIncident:'2023-11-15T06:30:00', createdAt:'2023-11-15T06:35:00', updatedAt:'2023-11-15T12:00:00', resolvedAt:'2023-11-15T12:00:00', resolutionTimeMin:325, impactScore:88, impactLevel:'High', officerNotes:[] },
  { id:'TSID00030', cause:'accident', corridor:'Mysore Road', junction:'Kengeri Signal', address:'Kengeri, Mysore Road, Bengaluru', lat:12.9082, lng:77.4977, priority:'High', status:'closed', requiresRoadClosure:false, vehicleType:'Motorcycle', description:'Bike skidded on wet road, rider injured.', direction:'Towards city', timeOfIncident:'2023-11-18T17:45:00', createdAt:'2023-11-18T17:50:00', updatedAt:'2023-11-18T19:00:00', resolvedAt:'2023-11-18T19:00:00', resolutionTimeMin:70, impactScore:82, impactLevel:'High', officerNotes:[] },
  { id:'TSID00031', cause:'pot_holes', corridor:'Tumkur Road', junction:'Peenya Junction', address:'Tumkur Road, Peenya, Bengaluru', lat:13.0285, lng:77.5260, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Cluster of potholes after BWSSB pipeline repair, 3 vehicles with tyre damage.', direction:'Both directions', timeOfIncident:'2023-11-20T09:00:00', createdAt:'2023-11-20T09:05:00', updatedAt:'2023-11-22T16:00:00', resolvedAt:'2023-11-22T16:00:00', resolutionTimeMin:2935, impactScore:42, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00032', cause:'vehicle_breakdown', corridor:'Hosur Road', junction:'Electronic City Toll', address:'Electronic City Flyover, Bengaluru', lat:12.8393, lng:77.6734, priority:'Low', status:'closed', requiresRoadClosure:false, vehicleType:'Car', breakdownReason:'Fuel empty', description:'Car stalled at toll plaza causing minor delay.', direction:'Outbound', timeOfIncident:'2023-11-22T19:15:00', createdAt:'2023-11-22T19:17:00', updatedAt:'2023-11-22T19:40:00', resolvedAt:'2023-11-22T19:40:00', resolutionTimeMin:23, impactScore:22, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00033', cause:'accident', corridor:'Bellary Road 1', junction:'Hebbal Flyover', address:'Hebbal Flyover, Bellary Road, Bengaluru', lat:13.0358, lng:77.5972, priority:'High', status:'resolved', requiresRoadClosure:true, vehicleType:'Truck', description:'Truck lost control on flyover, container spilled. 3-hour closure.', direction:'Airport direction', timeOfIncident:'2023-11-25T04:30:00', createdAt:'2023-11-25T04:35:00', updatedAt:'2023-11-25T07:30:00', resolvedAt:'2023-11-25T07:30:00', resolutionTimeMin:175, impactScore:95, impactLevel:'High', officerNotes:[{text:'Crane deployed. Debris cleared by 7am.',timestamp:'2023-11-25T07:00:00',author:'Admin'}] },
  { id:'TSID00034', cause:'public_event', corridor:'CBD 1', junction:'MG Road Junction', address:'MG Road, Bengaluru', lat:12.9767, lng:77.6097, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Kannada Rajyotsava celebrations, large processions on MG Road.', direction:'All directions', timeOfIncident:'2023-11-01T09:00:00', createdAt:'2023-11-01T09:00:00', updatedAt:'2023-11-01T21:00:00', resolvedAt:'2023-11-01T21:00:00', resolutionTimeMin:720, impactScore:72, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00035', cause:'tree_fall', corridor:'Bellary Road 2', junction:'Yelahanka Junction', address:'Bellary Road, Yelahanka, Bengaluru', lat:13.1007, lng:77.5963, priority:'High', status:'closed', requiresRoadClosure:true, description:'Large rain tree fell across both lanes during storm.', direction:'Both directions', timeOfIncident:'2023-12-02T14:20:00', createdAt:'2023-12-02T14:25:00', updatedAt:'2023-12-02T17:00:00', resolvedAt:'2023-12-02T17:00:00', resolutionTimeMin:155, impactScore:87, impactLevel:'High', officerNotes:[] },
  { id:'TSID00036', cause:'construction', corridor:'CBD 2', junction:'Cubbon Park Gate', address:'Kasturba Road, Cubbon Park, Bengaluru', lat:12.9795, lng:77.6007, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Storm drain repair work, one lane closed.', direction:'One-way affected', timeOfIncident:'2023-12-08T07:00:00', createdAt:'2023-12-08T07:00:00', updatedAt:'2023-12-08T18:00:00', resolvedAt:'2023-12-08T18:00:00', resolutionTimeMin:660, impactScore:38, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00037', cause:'accident', corridor:'ORR East 2', junction:'Kadubeesanahalli Junction', address:'ORR, Kadubeesanahalli, Bengaluru', lat:12.9480, lng:77.7145, priority:'High', status:'closed', requiresRoadClosure:true, vehicleType:'Car', description:'Head-on collision, both vehicles badly damaged.', direction:'Towards Hebbal', timeOfIncident:'2023-12-12T07:05:00', createdAt:'2023-12-12T07:10:00', updatedAt:'2023-12-12T09:00:00', resolvedAt:'2023-12-12T09:00:00', resolutionTimeMin:110, impactScore:93, impactLevel:'High', officerNotes:[] },
  { id:'TSID00038', cause:'vehicle_breakdown', corridor:'Tumkur Road', junction:'Yeshwanthpur Junction', address:'Yeshwanthpur, Tumkur Road, Bengaluru', lat:13.0228, lng:77.5510, priority:'Low', status:'closed', requiresRoadClosure:false, vehicleType:'Auto', breakdownReason:'Engine failure', description:'Auto-rickshaw stalled at busy junction causing minor tailback.', direction:'Towards Tumkur', timeOfIncident:'2023-12-14T11:00:00', createdAt:'2023-12-14T11:02:00', updatedAt:'2023-12-14T11:25:00', resolvedAt:'2023-12-14T11:25:00', resolutionTimeMin:23, impactScore:30, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00039', cause:'water_logging', corridor:'ORR North 1', junction:'Hebbal Junction', address:'ORR North, Hebbal, Bengaluru', lat:13.0358, lng:77.5970, priority:'High', status:'closed', requiresRoadClosure:true, description:'Severe flooding at low-lying ORR stretch after 3-hour downpour.', direction:'Both directions', timeOfIncident:'2023-12-18T15:00:00', createdAt:'2023-12-18T15:05:00', updatedAt:'2023-12-18T20:30:00', resolvedAt:'2023-12-18T20:30:00', resolutionTimeMin:325, impactScore:90, impactLevel:'High', officerNotes:[] },
  { id:'TSID00040', cause:'vip_movement', corridor:'CBD 1', junction:'Vidhana Soudha', address:'Dr Ambedkar Road, Bengaluru', lat:12.9794, lng:77.5907, priority:'High', status:'closed', requiresRoadClosure:true, description:'State cabinet meeting, multiple minister convoys.', direction:'CBD area', timeOfIncident:'2023-12-22T10:00:00', createdAt:'2023-12-22T09:45:00', updatedAt:'2023-12-22T13:00:00', resolvedAt:'2023-12-22T13:00:00', resolutionTimeMin:195, impactScore:89, impactLevel:'High', officerNotes:[] },
  { id:'TSID00041', cause:'accident', corridor:'Mysore Road', junction:'Nayandahalli Junction', address:'Nayandahalli, Mysore Road, Bengaluru', lat:12.9400, lng:77.5350, priority:'Medium', status:'closed', requiresRoadClosure:false, vehicleType:'Car', description:'Minor sideswipe, vehicles moved to shoulder.', direction:'Both directions', timeOfIncident:'2023-12-26T16:30:00', createdAt:'2023-12-26T16:35:00', updatedAt:'2023-12-26T17:10:00', resolvedAt:'2023-12-26T17:10:00', resolutionTimeMin:35, impactScore:55, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00042', cause:'construction', corridor:'Bellary Road 1', junction:'Hebbal Flyover', address:'Bellary Road, Hebbal, Bengaluru', lat:13.0358, lng:77.5970, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'NHAI highway widening, night work causing delays.', direction:'Airport bound', timeOfIncident:'2024-01-03T22:00:00', createdAt:'2024-01-03T22:00:00', updatedAt:'2024-01-04T05:00:00', resolvedAt:'2024-01-04T05:00:00', resolutionTimeMin:420, impactScore:64, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00043', cause:'pot_holes', corridor:'Hosur Road', junction:'Bommanahalli Signal', address:'Hosur Road, Bommanahalli, Bengaluru', lat:12.8980, lng:77.6170, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Deep crater near signal, 4 vehicle tyre failures reported.', direction:'Towards city', timeOfIncident:'2024-01-07T08:30:00', createdAt:'2024-01-07T08:35:00', updatedAt:'2024-01-08T14:00:00', resolvedAt:'2024-01-08T14:00:00', resolutionTimeMin:1765, impactScore:36, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00044', cause:'vehicle_breakdown', corridor:'ORR East 1', junction:'Silk Board Junction', address:'ORR, Silk Board, Bengaluru', lat:12.9173, lng:77.6230, priority:'High', status:'resolved', requiresRoadClosure:false, vehicleType:'Truck', description:'Overloaded truck with brake failure, parked on ORR shoulder.', direction:'Towards Hebbal', timeOfIncident:'2024-01-10T06:45:00', createdAt:'2024-01-10T06:50:00', updatedAt:'2024-01-10T08:15:00', resolvedAt:'2024-01-10T08:15:00', resolutionTimeMin:85, impactScore:75, impactLevel:'High', officerNotes:[] },
  { id:'TSID00045', cause:'accident', corridor:'CBD 2', junction:'Cubbon Park Gate', address:'Kasturba Road, Bengaluru', lat:12.9795, lng:77.6007, priority:'High', status:'closed', requiresRoadClosure:true, vehicleType:'Bus', description:'KSRTC bus and car collision, serious injuries.', direction:'Both directions', timeOfIncident:'2024-01-12T17:20:00', createdAt:'2024-01-12T17:25:00', updatedAt:'2024-01-12T19:30:00', resolvedAt:'2024-01-12T19:30:00', resolutionTimeMin:125, impactScore:92, impactLevel:'High', officerNotes:[] },
  { id:'TSID00046', cause:'water_logging', corridor:'Mysore Road', junction:'Kengeri Signal', address:'Kengeri Satellite Town, Mysore Road, Bengaluru', lat:12.9082, lng:77.4977, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Low-lying stretch flooded, traffic crawling.', direction:'Both directions', timeOfIncident:'2024-01-18T14:00:00', createdAt:'2024-01-18T14:05:00', updatedAt:'2024-01-18T18:30:00', resolvedAt:'2024-01-18T18:30:00', resolutionTimeMin:265, impactScore:68, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00047', cause:'tree_fall', corridor:'CBD 1', junction:'MG Road Junction', address:'MG Road, near Trinity Circle, Bengaluru', lat:12.9767, lng:77.6097, priority:'Medium', status:'closed', requiresRoadClosure:true, description:'Medium tree fell near Trinity Circle, one lane blocked.', direction:'Towards Brigade Road', timeOfIncident:'2024-01-20T13:10:00', createdAt:'2024-01-20T13:15:00', updatedAt:'2024-01-20T15:00:00', resolvedAt:'2024-01-20T15:00:00', resolutionTimeMin:105, impactScore:70, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00048', cause:'construction', corridor:'ORR East 2', junction:'Marathahalli Bridge', address:'ORR, Marathahalli, Bengaluru', lat:12.9561, lng:77.7010, priority:'High', status:'active', requiresRoadClosure:true, description:'Bridge maintenance, alternating single lane traffic.', direction:'Both directions', timeOfIncident:'2024-01-22T06:00:00', createdAt:'2024-01-22T06:00:00', updatedAt:'2024-04-01T06:00:00', impactScore:84, impactLevel:'High', officerNotes:[] },
  { id:'TSID00049', cause:'accident', corridor:'Tumkur Road', junction:'Jalahalli Cross', address:'Jalahalli Cross, Tumkur Road, Bengaluru', lat:13.0450, lng:77.5280, priority:'High', status:'closed', requiresRoadClosure:true, vehicleType:'Car', description:'Car vs motorcycle accident, biker in critical condition.', direction:'Towards city', timeOfIncident:'2024-01-24T07:50:00', createdAt:'2024-01-24T07:55:00', updatedAt:'2024-01-24T09:30:00', resolvedAt:'2024-01-24T09:30:00', resolutionTimeMin:95, impactScore:93, impactLevel:'High', officerNotes:[{text:'Ambulance dispatched. Victim airlifted.',timestamp:'2024-01-24T08:05:00',author:'Admin'}] },
  { id:'TSID00050', cause:'vip_movement', corridor:'Bellary Road 1', junction:'Hebbal Junction', address:'Hebbal Flyover, Bengaluru', lat:13.0358, lng:77.5972, priority:'High', status:'closed', requiresRoadClosure:true, description:'CMs of multiple states enroute airport for national meet.', direction:'Airport bound', timeOfIncident:'2024-01-26T09:30:00', createdAt:'2024-01-26T09:15:00', updatedAt:'2024-01-26T11:00:00', resolvedAt:'2024-01-26T11:00:00', resolutionTimeMin:105, impactScore:91, impactLevel:'High', officerNotes:[] },
  { id:'TSID00051', cause:'vehicle_breakdown', corridor:'CBD 1', junction:'Shivajinagar Bus Stand', address:'Shivajinagar, Bengaluru', lat:12.9860, lng:77.6011, priority:'Low', status:'closed', requiresRoadClosure:false, vehicleType:'Bus', description:'BMTC bus engine trouble at depot exit, blocking exit lane.', direction:'All directions', timeOfIncident:'2024-01-28T07:15:00', createdAt:'2024-01-28T07:17:00', updatedAt:'2024-01-28T08:00:00', resolvedAt:'2024-01-28T08:00:00', resolutionTimeMin:43, impactScore:34, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00052', cause:'accident', corridor:'ORR North 1', junction:'Hebbal Junction', address:'ORR North, near Manyata Tech, Bengaluru', lat:13.0455, lng:77.6199, priority:'High', status:'closed', requiresRoadClosure:false, vehicleType:'Car', description:'Three-car chain collision during morning rush, 2 injuries.', direction:'Towards Electronic City', timeOfIncident:'2024-02-01T08:30:00', createdAt:'2024-02-01T08:35:00', updatedAt:'2024-02-01T10:00:00', resolvedAt:'2024-02-01T10:00:00', resolutionTimeMin:85, impactScore:87, impactLevel:'High', officerNotes:[] },
  { id:'TSID00053', cause:'water_logging', corridor:'Bellary Road 1', junction:'Hebbal Flyover', address:'Hebbal Underpass, Bengaluru', lat:13.0358, lng:77.5970, priority:'High', status:'closed', requiresRoadClosure:true, description:'Hebbal underpass completely flooded, 6-hour closure.', direction:'Both directions', timeOfIncident:'2024-02-03T16:00:00', createdAt:'2024-02-03T16:05:00', updatedAt:'2024-02-03T22:00:00', resolvedAt:'2024-02-03T22:00:00', resolutionTimeMin:355, impactScore:96, impactLevel:'High', officerNotes:[] },
  { id:'TSID00054', cause:'construction', corridor:'Mysore Road', junction:'Nayandahalli Junction', address:'Nayandahalli, Mysore Road, Bengaluru', lat:12.9400, lng:77.5350, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Metro Phase 3 construction, service road dug up.', direction:'Both directions', timeOfIncident:'2024-02-07T07:00:00', createdAt:'2024-02-07T07:00:00', updatedAt:'2024-03-07T18:00:00', resolvedAt:'2024-03-07T18:00:00', resolutionTimeMin:43260, impactScore:66, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00055', cause:'pot_holes', corridor:'ORR East 1', junction:'Marathahalli Bridge', address:'ORR, Marathahalli, Bengaluru', lat:12.9561, lng:77.7010, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Multiple potholes after road-cut repair, slow traffic.', direction:'Towards Silk Board', timeOfIncident:'2024-02-09T10:00:00', createdAt:'2024-02-09T10:05:00', updatedAt:'2024-02-11T12:00:00', resolvedAt:'2024-02-11T12:00:00', resolutionTimeMin:2875, impactScore:47, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00056', cause:'accident', corridor:'CBD 1', junction:'MG Road Junction', address:'MG Road, near Garuda Mall, Bengaluru', lat:12.9767, lng:77.6097, priority:'Medium', status:'resolved', requiresRoadClosure:false, vehicleType:'Car', description:'Minor fender-bender, both drivers arguing on road.', direction:'Towards Commercial Street', timeOfIncident:'2024-02-12T13:45:00', createdAt:'2024-02-12T13:50:00', updatedAt:'2024-02-12T14:30:00', resolvedAt:'2024-02-12T14:30:00', resolutionTimeMin:40, impactScore:52, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00057', cause:'vehicle_breakdown', corridor:'Bellary Road 2', junction:'Yelahanka Junction', address:'Yelahanka New Town, Bellary Road, Bengaluru', lat:13.1007, lng:77.5963, priority:'Low', status:'closed', requiresRoadClosure:false, vehicleType:'Truck', description:'Goods vehicle with flat tyre on service road.', direction:'Towards Devanahalli', timeOfIncident:'2024-02-14T15:30:00', createdAt:'2024-02-14T15:32:00', updatedAt:'2024-02-14T16:15:00', resolvedAt:'2024-02-14T16:15:00', resolutionTimeMin:43, impactScore:28, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00058', cause:'public_event', corridor:'CBD 2', junction:'Mayo Hall Junction', address:'MG Road, Bengaluru', lat:12.9757, lng:77.6083, priority:'High', status:'closed', requiresRoadClosure:false, description:'IPL match at Chinnaswamy, massive crowd movement post-game.', direction:'All directions', timeOfIncident:'2024-02-16T21:00:00', createdAt:'2024-02-16T21:00:00', updatedAt:'2024-02-16T23:30:00', resolvedAt:'2024-02-16T23:30:00', resolutionTimeMin:150, impactScore:88, impactLevel:'High', officerNotes:[{text:'30 officers deployed near stadium.',timestamp:'2024-02-16T21:15:00',author:'Admin'}] },
  { id:'TSID00059', cause:'accident', corridor:'Hosur Road', junction:'Silk Board Junction', address:'Silk Board Flyover, Bengaluru', lat:12.9173, lng:77.6228, priority:'High', status:'resolved', requiresRoadClosure:true, vehicleType:'Bus', description:'BMTC bus rear-ended by truck on flyover. Significant damage.', direction:'Towards city', timeOfIncident:'2024-02-19T07:10:00', createdAt:'2024-02-19T07:15:00', updatedAt:'2024-02-19T09:30:00', resolvedAt:'2024-02-19T09:30:00', resolutionTimeMin:135, impactScore:90, impactLevel:'High', officerNotes:[] },
  { id:'TSID00060', cause:'tree_fall', corridor:'Tumkur Road', junction:'Yeshwanthpur Junction', address:'Yeshwanthpur, Tumkur Road, Bengaluru', lat:13.0228, lng:77.5510, priority:'Medium', status:'closed', requiresRoadClosure:true, description:'Roadside tree fell during thunderstorm, 1 car damaged.', direction:'Towards city', timeOfIncident:'2024-02-22T16:45:00', createdAt:'2024-02-22T16:50:00', updatedAt:'2024-02-22T18:30:00', resolvedAt:'2024-02-22T18:30:00', resolutionTimeMin:100, impactScore:73, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00061', cause:'vip_movement', corridor:'CBD 2', junction:'Vidhana Soudha', address:'Vidhana Soudha, Bengaluru', lat:12.9794, lng:77.5907, priority:'High', status:'closed', requiresRoadClosure:true, description:'National Governor conference, multiple VIP convoys.', direction:'CBD zone', timeOfIncident:'2024-02-25T10:00:00', createdAt:'2024-02-25T09:45:00', updatedAt:'2024-02-25T17:00:00', resolvedAt:'2024-02-25T17:00:00', resolutionTimeMin:435, impactScore:92, impactLevel:'High', officerNotes:[] },
  { id:'TSID00062', cause:'construction', corridor:'ORR North 1', junction:'Hebbal Junction', address:'ORR North, Hebbal, Bengaluru', lat:13.0358, lng:77.5970, priority:'High', status:'active', requiresRoadClosure:true, description:'Elevated corridor construction — cranes blocking outside lane.', direction:'Both directions', timeOfIncident:'2024-03-01T06:00:00', createdAt:'2024-03-01T06:00:00', updatedAt:'2024-04-01T06:00:00', impactScore:82, impactLevel:'High', officerNotes:[] },
  { id:'TSID00063', cause:'accident', corridor:'ORR East 1', junction:'Silk Board Junction', address:'Silk Board, ORR, Bengaluru', lat:12.9173, lng:77.6230, priority:'High', status:'resolved', requiresRoadClosure:true, vehicleType:'Car', description:'Car lost control and hit divider, two occupants injured.', direction:'Towards Hebbal', timeOfIncident:'2024-03-04T08:00:00', createdAt:'2024-03-04T08:05:00', updatedAt:'2024-03-04T09:45:00', resolvedAt:'2024-03-04T09:45:00', resolutionTimeMin:100, impactScore:91, impactLevel:'High', officerNotes:[] },
  { id:'TSID00064', cause:'vehicle_breakdown', corridor:'Hosur Road', junction:'BTM Layout Signal', address:'BTM Layout, Hosur Road, Bengaluru', lat:12.9166, lng:77.6175, priority:'Medium', status:'closed', requiresRoadClosure:false, vehicleType:'Car', breakdownReason:'Overheating', description:'Private car overheated in stop-and-go traffic.', direction:'Towards Electronic City', timeOfIncident:'2024-03-06T17:45:00', createdAt:'2024-03-06T17:47:00', updatedAt:'2024-03-06T18:30:00', resolvedAt:'2024-03-06T18:30:00', resolutionTimeMin:43, impactScore:45, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00065', cause:'water_logging', corridor:'CBD 1', junction:'MG Road Junction', address:'MG Road Underpass, Bengaluru', lat:12.9767, lng:77.6097, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'MG Road underpass partially flooded, slow traffic.', direction:'Both directions', timeOfIncident:'2024-03-08T14:30:00', createdAt:'2024-03-08T14:35:00', updatedAt:'2024-03-08T18:00:00', resolvedAt:'2024-03-08T18:00:00', resolutionTimeMin:205, impactScore:62, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00066', cause:'accident', corridor:'Bellary Road 2', junction:'Yelahanka Junction', address:'Yelahanka, Bellary Road, Bengaluru', lat:13.1007, lng:77.5963, priority:'High', status:'closed', requiresRoadClosure:false, vehicleType:'Motorcycle', description:'Motorcycle accident, pillion rider injured, FIR filed.', direction:'Towards Devanahalli', timeOfIncident:'2024-03-11T18:30:00', createdAt:'2024-03-11T18:35:00', updatedAt:'2024-03-11T20:00:00', resolvedAt:'2024-03-11T20:00:00', resolutionTimeMin:85, impactScore:84, impactLevel:'High', officerNotes:[] },
  { id:'TSID00067', cause:'pot_holes', corridor:'Bellary Road 1', junction:'Mekhri Circle', address:'Bellary Road, near Mekhri Circle, Bengaluru', lat:13.0028, lng:77.5801, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Road surface damage near flyover ramp.', direction:'Airport bound', timeOfIncident:'2024-03-13T09:00:00', createdAt:'2024-03-13T09:05:00', updatedAt:'2024-03-15T12:00:00', resolvedAt:'2024-03-15T12:00:00', resolutionTimeMin:3055, impactScore:33, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00068', cause:'construction', corridor:'Tumkur Road', junction:'Peenya Junction', address:'Peenya Industrial Area, Bengaluru', lat:13.0285, lng:77.5260, priority:'Medium', status:'closed', requiresRoadClosure:true, description:'Metro viaduct construction, major road sections closed.', direction:'Both directions', timeOfIncident:'2024-03-15T06:00:00', createdAt:'2024-03-15T06:00:00', updatedAt:'2024-03-25T18:00:00', resolvedAt:'2024-03-25T18:00:00', resolutionTimeMin:14880, impactScore:78, impactLevel:'High', officerNotes:[] },
  { id:'TSID00069', cause:'vehicle_breakdown', corridor:'ORR East 2', junction:'Kadubeesanahalli Junction', address:'ORR, Kadubeesanahalli, Bengaluru', lat:12.9480, lng:77.7145, priority:'Low', status:'closed', requiresRoadClosure:false, vehicleType:'Bus', breakdownReason:'Tyre burst', description:'Private AC bus tyre burst on ORR, caused sudden stop.', direction:'Towards Whitefield', timeOfIncident:'2024-03-17T10:30:00', createdAt:'2024-03-17T10:32:00', updatedAt:'2024-03-17T11:15:00', resolvedAt:'2024-03-17T11:15:00', resolutionTimeMin:43, impactScore:35, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00070', cause:'accident', corridor:'CBD 1', junction:'Shivajinagar Bus Stand', address:'Shivajinagar, Bengaluru', lat:12.9860, lng:77.6011, priority:'Medium', status:'resolved', requiresRoadClosure:false, vehicleType:'Auto', description:'Auto-rickshaw and car collision at signal, minor injuries.', direction:'Towards Majestic', timeOfIncident:'2024-03-19T17:00:00', createdAt:'2024-03-19T17:05:00', updatedAt:'2024-03-19T18:00:00', resolvedAt:'2024-03-19T18:00:00', resolutionTimeMin:55, impactScore:56, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00071', cause:'public_event', corridor:'Mysore Road', junction:'Nayandahalli Junction', address:'Mysore Road, Rajajinagar, Bengaluru', lat:12.9400, lng:77.5350, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Rajajinagar Ganesh festival procession, road crowded.', direction:'Towards city', timeOfIncident:'2023-11-08T17:00:00', createdAt:'2023-11-08T17:00:00', updatedAt:'2023-11-08T22:00:00', resolvedAt:'2023-11-08T22:00:00', resolutionTimeMin:300, impactScore:69, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00072', cause:'tree_fall', corridor:'ORR East 1', junction:'Marathahalli Bridge', address:'ORR, near Marathahalli, Bengaluru', lat:12.9561, lng:77.7010, priority:'High', status:'closed', requiresRoadClosure:true, description:'Massive tree uprooted in storm, hit parked vehicles.', direction:'Both directions', timeOfIncident:'2024-01-30T03:00:00', createdAt:'2024-01-30T03:10:00', updatedAt:'2024-01-30T06:30:00', resolvedAt:'2024-01-30T06:30:00', resolutionTimeMin:200, impactScore:88, impactLevel:'High', officerNotes:[] },
  { id:'TSID00073', cause:'others', corridor:'CBD 2', junction:'Mayo Hall Junction', address:'MG Road, Brigade Road junction, Bengaluru', lat:12.9757, lng:77.6083, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Illegally parked vehicles blocking lane, towing required.', direction:'Towards Brigade Road', timeOfIncident:'2024-02-03T11:00:00', createdAt:'2024-02-03T11:05:00', updatedAt:'2024-02-03T12:00:00', resolvedAt:'2024-02-03T12:00:00', resolutionTimeMin:55, impactScore:32, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00074', cause:'accident', corridor:'Hosur Road', junction:'Electronic City Toll', address:'Electronic City Phase 2, Bengaluru', lat:12.8456, lng:77.6603, priority:'High', status:'closed', requiresRoadClosure:true, vehicleType:'Truck', description:'Truck overturned at toll entry, goods spilled on road.', direction:'Outbound', timeOfIncident:'2024-02-08T04:45:00', createdAt:'2024-02-08T04:50:00', updatedAt:'2024-02-08T08:00:00', resolvedAt:'2024-02-08T08:00:00', resolutionTimeMin:195, impactScore:94, impactLevel:'High', officerNotes:[] },
  { id:'TSID00075', cause:'vehicle_breakdown', corridor:'Mysore Road', junction:'Kengeri Signal', address:'Kengeri, Mysore Road, Bengaluru', lat:12.9082, lng:77.4977, priority:'Low', status:'closed', requiresRoadClosure:false, vehicleType:'Car', breakdownReason:'Flat tyre', description:'Private vehicle changing tyre on road shoulder.', direction:'Towards Mysore', timeOfIncident:'2024-02-11T12:00:00', createdAt:'2024-02-11T12:02:00', updatedAt:'2024-02-11T12:35:00', resolvedAt:'2024-02-11T12:35:00', resolutionTimeMin:33, impactScore:26, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00076', cause:'construction', corridor:'CBD 2', junction:'Vidhana Soudha', address:'Dr Ambedkar Road, Bengaluru', lat:12.9794, lng:77.5907, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Footpath widening work, minor road encroachment.', direction:'One side affected', timeOfIncident:'2024-02-15T09:00:00', createdAt:'2024-02-15T09:00:00', updatedAt:'2024-02-16T18:00:00', resolvedAt:'2024-02-16T18:00:00', resolutionTimeMin:1980, impactScore:35, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00077', cause:'accident', corridor:'ORR North 1', junction:'Manyata Tech Park Junction', address:'Manyata Tech Park, ORR North, Bengaluru', lat:13.0455, lng:77.6199, priority:'High', status:'resolved', requiresRoadClosure:false, vehicleType:'Car', description:'Car hit pedestrian at zebra crossing, police case filed.', direction:'Towards Electronic City', timeOfIncident:'2024-02-21T19:30:00', createdAt:'2024-02-21T19:35:00', updatedAt:'2024-02-21T21:00:00', resolvedAt:'2024-02-21T21:00:00', resolutionTimeMin:85, impactScore:88, impactLevel:'High', officerNotes:[] },
  { id:'TSID00078', cause:'water_logging', corridor:'Tumkur Road', junction:'Yeshwanthpur Junction', address:'Yeshwanthpur, Tumkur Road, Bengaluru', lat:13.0228, lng:77.5510, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Service road flooded, diversions set up.', direction:'Towards Tumkur', timeOfIncident:'2024-02-26T15:00:00', createdAt:'2024-02-26T15:05:00', updatedAt:'2024-02-26T19:30:00', resolvedAt:'2024-02-26T19:30:00', resolutionTimeMin:265, impactScore:62, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00079', cause:'pot_holes', corridor:'ORR East 2', junction:'Varthur Junction', address:'ORR, Varthur, Bengaluru', lat:12.9354, lng:77.7360, priority:'Low', status:'draft', requiresRoadClosure:false, description:'Multiple potholes reported by public, field inspection pending.', direction:'Both directions', timeOfIncident:'2024-03-02T11:00:00', createdAt:'2024-03-02T11:05:00', updatedAt:'2024-03-02T11:05:00', impactScore:30, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00080', cause:'vip_movement', corridor:'Airport Road', junction:'Hebbal Flyover', address:'Bellary Road, Hebbal, Bengaluru', lat:13.0358, lng:77.5975, priority:'High', status:'closed', requiresRoadClosure:true, description:'Defence minister convoy with full escort, airport road closed.', direction:'Airport bound', timeOfIncident:'2024-03-07T11:00:00', createdAt:'2024-03-07T10:45:00', updatedAt:'2024-03-07T12:30:00', resolvedAt:'2024-03-07T12:30:00', resolutionTimeMin:105, impactScore:90, impactLevel:'High', officerNotes:[] },
  { id:'TSID00081', cause:'accident', corridor:'Mysore Road', junction:'Mysore Road NICE Junction', address:'Mysore Road, near NICE Road, Bengaluru', lat:12.9044, lng:77.5287, priority:'High', status:'closed', requiresRoadClosure:true, vehicleType:'Car', description:'Head-on collision at interchange. 3 vehicles involved.', direction:'Both directions', timeOfIncident:'2024-03-09T07:30:00', createdAt:'2024-03-09T07:35:00', updatedAt:'2024-03-09T09:30:00', resolvedAt:'2024-03-09T09:30:00', resolutionTimeMin:115, impactScore:93, impactLevel:'High', officerNotes:[] },
  { id:'TSID00082', cause:'vehicle_breakdown', corridor:'CBD 2', junction:'Cubbon Park Gate', address:'Cubbon Park Road, Bengaluru', lat:12.9795, lng:77.6007, priority:'Low', status:'closed', requiresRoadClosure:false, vehicleType:'Auto', description:'CNG auto with engine trouble, parked off road.', direction:'Towards Shivajinagar', timeOfIncident:'2024-03-11T14:45:00', createdAt:'2024-03-11T14:47:00', updatedAt:'2024-03-11T15:10:00', resolvedAt:'2024-03-11T15:10:00', resolutionTimeMin:23, impactScore:22, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00083', cause:'construction', corridor:'Bellary Road 1', junction:'Yelahanka Junction', address:'Bellary Road, Yelahanka, Bengaluru', lat:13.1007, lng:77.5963, priority:'Medium', status:'active', requiresRoadClosure:false, description:'Signal junction upgrade, temporary signal off.', direction:'Four-way affected', timeOfIncident:'2024-03-13T08:00:00', createdAt:'2024-03-13T08:00:00', updatedAt:'2024-04-01T18:00:00', impactScore:60, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00084', cause:'accident', corridor:'Hosur Road', junction:'BTM Layout Signal', address:'BTM 2nd Stage, Hosur Road, Bengaluru', lat:12.9166, lng:77.6175, priority:'Medium', status:'resolved', requiresRoadClosure:false, vehicleType:'Car', description:'Sideswipe in heavy traffic, minor damage.', direction:'Towards Electronic City', timeOfIncident:'2024-03-18T18:30:00', createdAt:'2024-03-18T18:35:00', updatedAt:'2024-03-18T19:15:00', resolvedAt:'2024-03-18T19:15:00', resolutionTimeMin:40, impactScore:50, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00085', cause:'water_logging', corridor:'ORR East 2', junction:'ITPL Junction', address:'ORR, ITPL Junction, Bengaluru', lat:12.9716, lng:77.7000, priority:'High', status:'closed', requiresRoadClosure:true, description:'Flash flooding on ORR after extreme rainfall, 5-hour closure.', direction:'Both directions', timeOfIncident:'2024-03-21T13:00:00', createdAt:'2024-03-21T13:05:00', updatedAt:'2024-03-21T18:00:00', resolvedAt:'2024-03-21T18:00:00', resolutionTimeMin:295, impactScore:95, impactLevel:'High', officerNotes:[] },
  { id:'TSID00086', cause:'tree_fall', corridor:'CBD 1', junction:'Shivajinagar Bus Stand', address:'Shivajinagar, near bus stand, Bengaluru', lat:12.9860, lng:77.6011, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Branch fell on parked vehicles, no injuries.', direction:'Entry road affected', timeOfIncident:'2024-03-23T11:30:00', createdAt:'2024-03-23T11:35:00', updatedAt:'2024-03-23T13:00:00', resolvedAt:'2024-03-23T13:00:00', resolutionTimeMin:85, impactScore:62, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00087', cause:'accident', corridor:'ORR East 1', junction:'HSR Layout Junction', address:'HSR Layout, ORR, Bengaluru', lat:12.9123, lng:77.6450, priority:'High', status:'resolved', requiresRoadClosure:true, vehicleType:'Truck', description:'Truck skid, container partially blocking ORR.', direction:'Towards Silk Board', timeOfIncident:'2024-03-26T05:30:00', createdAt:'2024-03-26T05:35:00', updatedAt:'2024-03-26T08:00:00', resolvedAt:'2024-03-26T08:00:00', resolutionTimeMin:145, impactScore:90, impactLevel:'High', officerNotes:[] },
  { id:'TSID00088', cause:'vehicle_breakdown', corridor:'ORR North 1', junction:'Manyata Tech Park Junction', address:'Manyata Tech Park, Bengaluru', lat:13.0455, lng:77.6199, priority:'Low', status:'closed', requiresRoadClosure:false, vehicleType:'Car', breakdownReason:'Battery dead', description:'Car stalled outside tech park gate.', direction:'Towards Hebbal', timeOfIncident:'2024-03-28T09:15:00', createdAt:'2024-03-28T09:17:00', updatedAt:'2024-03-28T09:45:00', resolvedAt:'2024-03-28T09:45:00', resolutionTimeMin:28, impactScore:22, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00089', cause:'public_event', corridor:'Bellary Road 1', junction:'Hebbal Flyover', address:'Bellary Road, Hebbal, Bengaluru', lat:13.0358, lng:77.5972, priority:'High', status:'closed', requiresRoadClosure:true, description:'International cricket at Chinnaswamy, airport road choked.', direction:'Both directions', timeOfIncident:'2024-03-30T16:00:00', createdAt:'2024-03-30T16:00:00', updatedAt:'2024-03-31T00:00:00', resolvedAt:'2024-03-31T00:00:00', resolutionTimeMin:480, impactScore:91, impactLevel:'High', officerNotes:[] },
  { id:'TSID00090', cause:'accident', corridor:'CBD 2', junction:'Vidhana Soudha', address:'Dr Ambedkar Road, Bengaluru', lat:12.9794, lng:77.5907, priority:'Medium', status:'resolved', requiresRoadClosure:false, vehicleType:'Auto', description:'Auto vs bicycle accident near Vidhana Soudha gate.', direction:'Towards Cubbon Park', timeOfIncident:'2024-04-01T11:00:00', createdAt:'2024-04-01T11:05:00', updatedAt:'2024-04-01T11:50:00', resolvedAt:'2024-04-01T11:50:00', resolutionTimeMin:45, impactScore:51, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00091', cause:'construction', corridor:'Hosur Road', junction:'Silk Board Junction', address:'Silk Board, Hosur Road, Bengaluru', lat:12.9173, lng:77.6228, priority:'High', status:'active', requiresRoadClosure:true, description:'Grade separator construction. Signal-free corridor work causes full closure on service road.', direction:'Service road closed', timeOfIncident:'2024-04-01T06:00:00', createdAt:'2024-04-01T06:00:00', updatedAt:'2024-04-01T18:00:00', impactScore:87, impactLevel:'High', officerNotes:[] },
  { id:'TSID00092', cause:'water_logging', corridor:'Mysore Road', junction:'Mysore Road NICE Junction', address:'Mysore Road, Kengeri, Bengaluru', lat:12.9044, lng:77.5287, priority:'Medium', status:'draft', requiresRoadClosure:false, description:'Repeated flooding at this stretch during rain. Citizens complaint logged.', direction:'Both directions', timeOfIncident:'2024-04-02T08:00:00', createdAt:'2024-04-02T08:05:00', updatedAt:'2024-04-02T08:05:00', impactScore:60, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00093', cause:'accident', corridor:'Bellary Road 1', junction:'Mekhri Circle', address:'Bellary Road, near Mekhri Circle, Bengaluru', lat:13.0028, lng:77.5801, priority:'High', status:'active', requiresRoadClosure:false, vehicleType:'Car', description:'Multi-car pileup at signal, 4 vehicles involved, 2 injuries.', direction:'Towards Hebbal', timeOfIncident:'2024-04-02T08:45:00', createdAt:'2024-04-02T08:50:00', updatedAt:'2024-04-02T09:30:00', impactScore:89, impactLevel:'High', officerNotes:[{text:'Ambulance on site. 2 taken to Mallya Hospital.',timestamp:'2024-04-02T09:00:00',author:'Admin'}] },
  { id:'TSID00094', cause:'vehicle_breakdown', corridor:'ORR East 2', junction:'ITPL Junction', address:'ORR, ITPL, Bengaluru', lat:12.9716, lng:77.7000, priority:'Medium', status:'active', requiresRoadClosure:false, vehicleType:'Bus', breakdownReason:'Engine failure', description:'Volvo office cab stalled on ORR, blocking right lane.', direction:'Towards Whitefield', timeOfIncident:'2024-04-02T09:30:00', createdAt:'2024-04-02T09:32:00', updatedAt:'2024-04-02T09:32:00', impactScore:58, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00095', cause:'pot_holes', corridor:'Tumkur Road', junction:'Jalahalli Cross', address:'Jalahalli Cross, Tumkur Road, Bengaluru', lat:13.0450, lng:77.5280, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Pothole at intersection causing tyre damage to motorcycles.', direction:'Both directions', timeOfIncident:'2024-03-05T10:00:00', createdAt:'2024-03-05T10:05:00', updatedAt:'2024-03-06T16:00:00', resolvedAt:'2024-03-06T16:00:00', resolutionTimeMin:1795, impactScore:32, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00096', cause:'accident', corridor:'ORR East 2', junction:'Varthur Junction', address:'Varthur, ORR, Bengaluru', lat:12.9354, lng:77.7360, priority:'High', status:'closed', requiresRoadClosure:true, vehicleType:'Car', description:'SUV rolled over on ORR, driver trapped. BFES called.', direction:'Towards Whitefield', timeOfIncident:'2024-02-17T23:45:00', createdAt:'2024-02-17T23:50:00', updatedAt:'2024-02-18T02:00:00', resolvedAt:'2024-02-18T02:00:00', resolutionTimeMin:130, impactScore:96, impactLevel:'High', officerNotes:[] },
  { id:'TSID00097', cause:'construction', corridor:'CBD 1', junction:'Shivajinagar Bus Stand', address:'Shivajinagar, Bengaluru', lat:12.9860, lng:77.6011, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Pavement reconstruction outside bus stand.', direction:'Footpath area', timeOfIncident:'2024-01-16T08:00:00', createdAt:'2024-01-16T08:00:00', updatedAt:'2024-01-17T18:00:00', resolvedAt:'2024-01-17T18:00:00', resolutionTimeMin:2040, impactScore:30, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00098', cause:'others', corridor:'Hosur Road', junction:'Silk Board Junction', address:'Silk Board Junction, Bengaluru', lat:12.9173, lng:77.6228, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Stray cattle on road causing sudden braking and near-misses.', direction:'Both directions', timeOfIncident:'2024-01-19T05:30:00', createdAt:'2024-01-19T05:35:00', updatedAt:'2024-01-19T06:30:00', resolvedAt:'2024-01-19T06:30:00', resolutionTimeMin:55, impactScore:58, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00099', cause:'vip_movement', corridor:'Mysore Road', junction:'Nayandahalli Junction', address:'Mysore Road, Bengaluru', lat:12.9400, lng:77.5350, priority:'High', status:'closed', requiresRoadClosure:true, description:'State CMs returning from Mysore conference, convoy via Mysore Road.', direction:'Towards city', timeOfIncident:'2024-02-29T17:00:00', createdAt:'2024-02-29T16:45:00', updatedAt:'2024-02-29T18:30:00', resolvedAt:'2024-02-29T18:30:00', resolutionTimeMin:105, impactScore:89, impactLevel:'High', officerNotes:[] },
  { id:'TSID00100', cause:'accident', corridor:'Tumkur Road', junction:'Peenya Junction', address:'Peenya, Tumkur Road, Bengaluru', lat:13.0285, lng:77.5260, priority:'Medium', status:'resolved', requiresRoadClosure:false, vehicleType:'Car', description:'Car T-boned at signal, driver and passenger injured.', direction:'Towards city', timeOfIncident:'2024-02-27T08:20:00', createdAt:'2024-02-27T08:25:00', updatedAt:'2024-02-27T09:30:00', resolvedAt:'2024-02-27T09:30:00', resolutionTimeMin:65, impactScore:67, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00101', cause:'water_logging', corridor:'ORR East 1', junction:'HSR Layout Junction', address:'HSR Layout, ORR, Bengaluru', lat:12.9123, lng:77.6450, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Storm drain overflow flooding ORR service road.', direction:'Towards Silk Board', timeOfIncident:'2024-01-11T16:45:00', createdAt:'2024-01-11T16:50:00', updatedAt:'2024-01-11T21:00:00', resolvedAt:'2024-01-11T21:00:00', resolutionTimeMin:250, impactScore:65, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00102', cause:'tree_fall', corridor:'Tumkur Road', junction:'Jalahalli Cross', address:'Jalahalli, Tumkur Road, Bengaluru', lat:13.0450, lng:77.5280, priority:'High', status:'closed', requiresRoadClosure:true, description:'Banyan tree collapsed across dual carriageway.', direction:'Both directions', timeOfIncident:'2023-12-08T11:00:00', createdAt:'2023-12-08T11:05:00', updatedAt:'2023-12-08T14:00:00', resolvedAt:'2023-12-08T14:00:00', resolutionTimeMin:175, impactScore:86, impactLevel:'High', officerNotes:[] },
  { id:'TSID00103', cause:'accident', corridor:'CBD 1', junction:'MG Road Junction', address:'MG Road, near Anil Kumble Circle, Bengaluru', lat:12.9767, lng:77.6097, priority:'High', status:'closed', requiresRoadClosure:false, vehicleType:'Motorcycle', description:'Biker knocked by opening car door, fractured arm.', direction:'Towards Majestic', timeOfIncident:'2023-12-15T16:00:00', createdAt:'2023-12-15T16:05:00', updatedAt:'2023-12-15T17:30:00', resolvedAt:'2023-12-15T17:30:00', resolutionTimeMin:85, impactScore:76, impactLevel:'High', officerNotes:[] },
  { id:'TSID00104', cause:'others', corridor:'ORR North 1', junction:'Hebbal Junction', address:'Hebbal, ORR North, Bengaluru', lat:13.0455, lng:77.6199, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Protest dharna on road shoulder, minor congestion.', direction:'One lane affected', timeOfIncident:'2024-01-08T10:00:00', createdAt:'2024-01-08T10:05:00', updatedAt:'2024-01-08T13:00:00', resolvedAt:'2024-01-08T13:00:00', resolutionTimeMin:175, impactScore:40, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00105', cause:'vehicle_breakdown', corridor:'ORR East 1', junction:'HSR Layout Junction', address:'HSR Layout, ORR, Bengaluru', lat:12.9123, lng:77.6450, priority:'Medium', status:'closed', requiresRoadClosure:false, vehicleType:'Car', description:'Private car with blown engine on ORR shoulder.', direction:'Towards Silk Board', timeOfIncident:'2024-01-14T14:30:00', createdAt:'2024-01-14T14:32:00', updatedAt:'2024-01-14T15:15:00', resolvedAt:'2024-01-14T15:15:00', resolutionTimeMin:43, impactScore:42, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00106', cause:'accident', corridor:'Bellary Road 2', junction:'Doddaballapura Road', address:'Bellary Road, near Doddaballapura, Bengaluru', lat:13.1200, lng:77.5850, priority:'High', status:'closed', requiresRoadClosure:true, vehicleType:'Truck', description:'Inter-state truck hit highway divider, overturned.', direction:'Towards Bengaluru', timeOfIncident:'2023-11-14T02:30:00', createdAt:'2023-11-14T02:35:00', updatedAt:'2023-11-14T06:00:00', resolvedAt:'2023-11-14T06:00:00', resolutionTimeMin:205, impactScore:95, impactLevel:'High', officerNotes:[] },
  { id:'TSID00107', cause:'construction', corridor:'ORR East 2', junction:'ITPL Junction', address:'ORR, ITPL, Whitefield, Bengaluru', lat:12.9716, lng:77.7000, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Broadband cable laying cutting across ORR.', direction:'One lane affected', timeOfIncident:'2024-01-04T09:00:00', createdAt:'2024-01-04T09:00:00', updatedAt:'2024-01-04T20:00:00', resolvedAt:'2024-01-04T20:00:00', resolutionTimeMin:660, impactScore:55, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00108', cause:'pot_holes', corridor:'CBD 2', junction:'Mayo Hall Junction', address:'MG Road, Bengaluru', lat:12.9757, lng:77.6083, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Depression on MG Road surface, vehicles deflecting.', direction:'Towards Residency Road', timeOfIncident:'2023-12-03T09:30:00', createdAt:'2023-12-03T09:35:00', updatedAt:'2023-12-05T14:00:00', resolvedAt:'2023-12-05T14:00:00', resolutionTimeMin:2905, impactScore:34, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00109', cause:'accident', corridor:'Hosur Road', junction:'BTM Layout Signal', address:'BTM 1st Stage, Hosur Road, Bengaluru', lat:12.9166, lng:77.6175, priority:'High', status:'resolved', requiresRoadClosure:true, vehicleType:'Bus', description:'BMTC bus mounted footpath injuring pedestrians.', direction:'Towards city', timeOfIncident:'2024-02-24T09:30:00', createdAt:'2024-02-24T09:35:00', updatedAt:'2024-02-24T11:30:00', resolvedAt:'2024-02-24T11:30:00', resolutionTimeMin:115, impactScore:94, impactLevel:'High', officerNotes:[{text:'3 pedestrians hospitalised. FIR registered.',timestamp:'2024-02-24T10:00:00',author:'Admin'}] },
  { id:'TSID00110', cause:'water_logging', corridor:'CBD 2', junction:'Vidhana Soudha', address:'Ambedkar Rd near Vidhana Soudha, Bengaluru', lat:12.9794, lng:77.5907, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Minor puddles after short shower, no major disruption.', direction:'Both directions', timeOfIncident:'2024-03-25T17:30:00', createdAt:'2024-03-25T17:35:00', updatedAt:'2024-03-25T19:00:00', resolvedAt:'2024-03-25T19:00:00', resolutionTimeMin:85, impactScore:28, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00111', cause:'vehicle_breakdown', corridor:'Hosur Road', junction:'Silk Board Junction', address:'Silk Board Junction, Bengaluru', lat:12.9173, lng:77.6228, priority:'High', status:'resolved', requiresRoadClosure:false, vehicleType:'Truck', breakdownReason:'Engine seizure', description:'Heavy goods vehicle broke down at peak morning hour.', direction:'Towards Electronic City', timeOfIncident:'2024-03-27T07:55:00', createdAt:'2024-03-27T08:00:00', updatedAt:'2024-03-27T09:30:00', resolvedAt:'2024-03-27T09:30:00', resolutionTimeMin:90, impactScore:78, impactLevel:'High', officerNotes:[] },
  { id:'TSID00112', cause:'accident', corridor:'ORR East 2', junction:'Marathahalli Bridge', address:'Marathahalli Bridge, ORR, Bengaluru', lat:12.9561, lng:77.7010, priority:'High', status:'closed', requiresRoadClosure:true, vehicleType:'Car', description:'Car plunged into roadside ditch on bridge approach.', direction:'Towards Whitefield', timeOfIncident:'2024-03-30T21:00:00', createdAt:'2024-03-30T21:05:00', updatedAt:'2024-03-30T23:00:00', resolvedAt:'2024-03-30T23:00:00', resolutionTimeMin:115, impactScore:91, impactLevel:'High', officerNotes:[] },
  { id:'TSID00113', cause:'tree_fall', corridor:'ORR North 1', junction:'Manyata Tech Park Junction', address:'Manyata Tech Park, Bengaluru', lat:13.0455, lng:77.6199, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Branch fall near tech park entry, minor obstruction.', direction:'Entry road', timeOfIncident:'2024-02-18T14:00:00', createdAt:'2024-02-18T14:05:00', updatedAt:'2024-02-18T15:30:00', resolvedAt:'2024-02-18T15:30:00', resolutionTimeMin:85, impactScore:55, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00114', cause:'public_event', corridor:'Tumkur Road', junction:'Peenya Junction', address:'Peenya Industrial Area, Bengaluru', lat:13.0285, lng:77.5260, priority:'Medium', status:'closed', requiresRoadClosure:false, description:'Labour union march on Tumkur Road, partial traffic diversion.', direction:'Towards city', timeOfIncident:'2024-01-17T10:00:00', createdAt:'2024-01-17T10:00:00', updatedAt:'2024-01-17T14:00:00', resolvedAt:'2024-01-17T14:00:00', resolutionTimeMin:240, impactScore:65, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00115', cause:'accident', corridor:'Bellary Road 1', junction:'Yelahanka Junction', address:'Yelahanka, Bellary Road, Bengaluru', lat:13.1007, lng:77.5963, priority:'High', status:'resolved', requiresRoadClosure:false, vehicleType:'Car', description:'Rear-end on highway at 120kmph, critical injuries.', direction:'Airport bound', timeOfIncident:'2023-11-27T22:00:00', createdAt:'2023-11-27T22:05:00', updatedAt:'2023-11-27T23:30:00', resolvedAt:'2023-11-27T23:30:00', resolutionTimeMin:85, impactScore:93, impactLevel:'High', officerNotes:[] },
  { id:'TSID00116', cause:'construction', corridor:'Mysore Road', junction:'Kengeri Signal', address:'Kengeri, Mysore Road, Bengaluru', lat:12.9082, lng:77.4977, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Signal pole replacement work, manual traffic control.', direction:'Four-way affected', timeOfIncident:'2024-02-05T09:00:00', createdAt:'2024-02-05T09:00:00', updatedAt:'2024-02-05T17:00:00', resolvedAt:'2024-02-05T17:00:00', resolutionTimeMin:480, impactScore:42, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00117', cause:'others', corridor:'CBD 1', junction:'MG Road Junction', address:'MG Road, Bengaluru', lat:12.9767, lng:77.6097, priority:'Low', status:'closed', requiresRoadClosure:false, description:'Flash mob event, brief crowd on road.', direction:'One lane affected', timeOfIncident:'2024-03-16T12:00:00', createdAt:'2024-03-16T12:05:00', updatedAt:'2024-03-16T12:45:00', resolvedAt:'2024-03-16T12:45:00', resolutionTimeMin:40, impactScore:30, impactLevel:'Low', officerNotes:[] },
  { id:'TSID00118', cause:'vehicle_breakdown', corridor:'Bellary Road 1', junction:'Hebbal Flyover', address:'Hebbal Flyover, Bengaluru', lat:13.0358, lng:77.5970, priority:'Medium', status:'resolved', requiresRoadClosure:false, vehicleType:'Car', breakdownReason:'Tyre burst', description:'Car with burst tyre on flyover, partially blocking lane.', direction:'Airport bound', timeOfIncident:'2024-03-31T12:30:00', createdAt:'2024-03-31T12:32:00', updatedAt:'2024-03-31T13:15:00', resolvedAt:'2024-03-31T13:15:00', resolutionTimeMin:43, impactScore:56, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00119', cause:'accident', corridor:'Hosur Road', junction:'Electronic City Toll', address:'Electronic City Toll Plaza, Bengaluru', lat:12.8456, lng:77.6603, priority:'Medium', status:'resolved', requiresRoadClosure:false, vehicleType:'Auto', description:'Auto-rickshaw vs delivery bike collision at toll gate.', direction:'Outbound', timeOfIncident:'2024-04-01T15:30:00', createdAt:'2024-04-01T15:35:00', updatedAt:'2024-04-01T16:30:00', resolvedAt:'2024-04-01T16:30:00', resolutionTimeMin:55, impactScore:55, impactLevel:'Medium', officerNotes:[] },
  { id:'TSID00120', cause:'water_logging', corridor:'Bellary Road 2', junction:'Doddaballapura Road', address:'Bellary Road, Yelahanka, Bengaluru', lat:13.1200, lng:77.5850, priority:'Medium', status:'draft', requiresRoadClosure:false, description:'Citizen complaint: chronic flooding at this junction during monsoon.', direction:'Both directions', timeOfIncident:'2024-04-02T09:00:00', createdAt:'2024-04-02T09:05:00', updatedAt:'2024-04-02T09:05:00', impactScore:60, impactLevel:'Medium', officerNotes:[] }
];

// Generate 8000+ historical incidents
const CORRIDORS_LIST = [
  'Mysore Road', 'Bellary Road 1', 'Bellary Road 2', 'Tumkur Road', 'Hosur Road',
  'ORR East 1', 'ORR East 2', 'ORR North 1', 'CBD 1', 'CBD 2',
  'Old Madras Road', 'Bannerghatta Road', 'Kanakapura Road', 'Airport Road',
  'Whitefield Road', 'Sarjapur Road', 'Hebbal Flyover', 'Outer Ring Road West',
  'Electronic City Phase 1', 'Electronic City Phase 2', 'KR Puram Bridge', 'Marathahalli Bridge'
];
const CAUSES_LIST = ['accident','vehicle_breakdown','construction','water_logging','tree_fall','public_event','vip_movement','pot_holes','others'] as const;
const PRIORITIES = ['High','Medium','Low'] as const;
const STATUSES = ['active','resolved','closed'] as const;
const JUNCTIONS_LIST = [
  'Silk Board Junction','Hebbal Flyover','Mekhri Circle','Yeshwanthpur Junction',
  'Peenya Junction','BTM Layout Signal','Marathahalli Bridge','KR Puram Bridge',
  'Electronic City Toll','Nayandahalli Junction','Kengeri Signal','MG Road Junction'
];

function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function generateBulkIncidents(count: number): Incident[] {
  const r = rng(42);
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(r() * arr.length)];
  const results: Incident[] = [];
  const now = Date.now();
  const twoYears = 2 * 365 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const cause = pick(CAUSES_LIST);
    const corridor = pick(CORRIDORS_LIST);
    const priority = pick(PRIORITIES);
    const status = pick(STATUSES);
    const timeOffset = Math.floor(r() * twoYears);
    const incidentTime = new Date(now - timeOffset).toISOString();
    const score = Math.round(30 + r() * 60);
    const closure = r() > 0.7;
    const resTime = status === 'resolved' || status === 'closed' ? Math.round(15 + r() * 90) : undefined;

    results.push({
      id: `TSID${80000 + i}`,
      cause,
      corridor,
      junction: JUNCTIONS_LIST[Math.floor(r() * JUNCTIONS_LIST.length)],
      address: `${Math.floor(r() * 200)} ${corridor}`,
      lat: 12.7 + r() * 0.6,
      lng: 77.4 + r() * 0.5,
      priority,
      status,
      requiresRoadClosure: closure,
      description: `${cause.replace(/_/g,' ')} reported on ${corridor}`,
      direction: r() > 0.5 ? 'North to South' : 'East to West',
      timeOfIncident: incidentTime,
      createdAt: incidentTime,
      updatedAt: incidentTime,
      resolvedAt: resTime ? new Date(new Date(incidentTime).getTime() + resTime * 60000).toISOString() : undefined,
      resolutionTimeMin: resTime,
      impactScore: score,
      impactLevel: score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low',
      officerNotes: [],
    });
  }
  return results;
}

export const BULK_INCIDENTS = generateBulkIncidents(8000);
export const ALL_INCIDENTS = [...MOCK_INCIDENTS, ...BULK_INCIDENTS];
