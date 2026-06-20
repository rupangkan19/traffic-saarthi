import csv
import json
import os
from datetime import datetime

CSV_PATH = r"c:\Users\Lenovo\Desktop\TrafficSaarthi_v2\Astram event data_anonymized - Astram event data_anonymizedb40ac87.csv"
OUTPUT_PATH = r"c:\Users\Lenovo\Desktop\TrafficSaarthi_v2\v2\astram\src\data\analyticsData.json"

def parse_dt(dt_str):
    if not dt_str or dt_str.upper() == 'NULL' or dt_str.strip() == '':
        return None
    # Strip timezone suffix e.g. +00 or +00:00 or Z
    if '+' in dt_str:
        dt_str = dt_str.split('+')[0]
    elif 'Z' in dt_str:
        dt_str = dt_str.split('Z')[0]
    # Strip microsecond suffix
    if '.' in dt_str:
        dt_str = dt_str.split('.')[0]
    dt_str = dt_str.strip()
    for fmt in ('%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M', '%Y-%m-%d'):
        try:
            return datetime.strptime(dt_str, fmt)
        except ValueError:
            continue
    return None

def clean_label(label):
    if not label or label.upper() == 'NULL':
        return 'others'
    return label.strip().lower()

def main():
    print(f"Reading dataset from: {CSV_PATH}")
    if not os.path.exists(CSV_PATH):
        print(f"Error: CSV file not found at {CSV_PATH}")
        return

    # Containers for calculations
    total_incidents = 0
    active_incidents = 0
    high_priority_incidents = 0
    road_closures = 0
    
    # Aggregation stores
    by_cause = {}
    by_priority = {"High": 0, "Medium": 0, "Low": 0}
    by_veh_type = {}
    by_corridor = {}
    by_zone = {}
    by_hour = [0] * 24
    by_month = {}  # Format: {"Nov 23": {"high": 0, "medium": 0, "low": 0}}
    
    # Resolution times (in minutes)
    resolution_times = []
    res_by_cause = {} # {cause: [times]}
    
    # Road closures by cause
    closures_by_cause = {} # {cause: closures_count}
    
    # Hotspots coords: limit to valid coords in Bangalore
    hotspots = []

    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            total_incidents += 1
            
            # 1. Status
            status = row.get('status', '').strip().lower()
            if status == 'active':
                active_incidents += 1
                
            # 2. Priority
            priority = row.get('priority', '').strip().title()
            if priority not in by_priority:
                # Map unknown or blank priorities to Medium
                priority = 'Medium'
            by_priority[priority] += 1
            if priority == 'High':
                high_priority_incidents += 1
                
            # 3. Road closure
            closure_str = row.get('requires_road_closure', '').strip().upper()
            is_closure = (closure_str == 'TRUE')
            if is_closure:
                road_closures += 1
                
            # 4. Cause
            cause = clean_label(row.get('event_cause', 'others'))
            by_cause[cause] = by_cause.get(cause, 0) + 1
            if is_closure:
                closures_by_cause[cause] = closures_by_cause.get(cause, 0) + 1

            # 5. Vehicle type
            veh = clean_label(row.get('veh_type', 'others'))
            if veh != 'null' and veh != '':
                by_veh_type[veh] = by_veh_type.get(veh, 0) + 1
                
            # 6. Corridor
            corridor = row.get('corridor', '').strip()
            if corridor and corridor.upper() != 'NULL':
                by_corridor[corridor] = by_corridor.get(corridor, 0) + 1
                
            # 7. Zone
            zone = row.get('zone', '').strip()
            if zone and zone.upper() != 'NULL':
                by_zone[zone] = by_zone.get(zone, 0) + 1

            # 8. Date and Time parsing
            start_dt = parse_dt(row.get('start_datetime', ''))
            resolved_dt = parse_dt(row.get('resolved_datetime', ''))
            closed_dt = parse_dt(row.get('closed_datetime', ''))
            
            if start_dt:
                # Hourly distribution
                by_hour[start_dt.hour] += 1
                
                # Monthly distribution
                month_label = start_dt.strftime('%b %y') # e.g. "Nov 23"
                if month_label not in by_month:
                    by_month[month_label] = {"month": month_label, "high": 0, "medium": 0, "low": 0, "count": 0}
                by_month[month_label]["count"] += 1
                if priority == 'High':
                    by_month[month_label]["high"] += 1
                elif priority == 'Medium':
                    by_month[month_label]["medium"] += 1
                else:
                    by_month[month_label]["low"] += 1
            
            # Resolution time logic
            end_dt = resolved_dt if resolved_dt else closed_dt
            if start_dt and end_dt:
                diff_min = int((end_dt - start_dt).total_seconds() / 60.0)
                # Filter out negative or abnormally large resolution times (> 7 days)
                if 0 <= diff_min <= 10080:
                    resolution_times.append(diff_min)
                    if cause not in res_by_cause:
                        res_by_cause[cause] = []
                    res_by_cause[cause].append(diff_min)
            
            # Hotspots mapping (Bangalore bounding box)
            try:
                lat = float(row.get('latitude', 0))
                lng = float(row.get('longitude', 0))
                if 12.8 <= lat <= 13.2 and 77.4 <= lng <= 77.8:
                    desc = row.get('description', '')
                    if not desc or desc.upper() == 'NULL':
                        desc = row.get('address', '')
                    # clean description if it's too long
                    desc = desc[:80] + "..." if len(desc) > 80 else desc
                    hotspots.append({
                        "lat": lat,
                        "lng": lng,
                        "cause": cause,
                        "priority": priority,
                        "desc": desc
                    })
            except (ValueError, TypeError):
                pass

    # Post processing:
    # 1. Average resolution times
    overall_avg_res = int(sum(resolution_times) / len(resolution_times)) if resolution_times else 0
    avg_res_by_cause = {}
    for cause, times in res_by_cause.items():
        if times:
            avg_res_by_cause[cause] = int(sum(times) / len(times))
            
    # Sort monthly trend chronologically (using standard datetime conversion for sorting)
    def month_sort_key(item):
        try:
            return datetime.strptime(item[0], '%b %y')
        except ValueError:
            return datetime.min
            
    sorted_months = sorted(by_month.items(), key=month_sort_key)
    monthly_trend = [val for key, val in sorted_months]

    # Convert hour distribution to chart-friendly list
    hourly_trend = [{"hour": f"{h:02d}:00", "count": by_hour[h]} for h in range(24)]

    # Cause, vehicle, zone, corridor sorting
    cause_data = [{"name": c.replace('_', ' ').title(), "value": count, "raw": c} for c, count in sorted(by_cause.items(), key=lambda x: x[1], reverse=True)]
    veh_data = [{"name": v.replace('_', ' ').title(), "value": count} for v, count in sorted(by_veh_type.items(), key=lambda x: x[1], reverse=True)]
    corridor_data = [{"name": c, "value": count} for c, count in sorted(by_corridor.items(), key=lambda x: x[1], reverse=True)]
    zone_data = [{"name": z, "value": count} for z, count in sorted(by_zone.items(), key=lambda x: x[1], reverse=True)]

    # Format priority
    priority_data = [
        {"name": "High", "value": by_priority["High"]},
        {"name": "Medium", "value": by_priority["Medium"]},
        {"name": "Low", "value": by_priority["Low"]}
    ]

    # Limit hotspots for map readability and JSON performance (e.g. keep last 2000 incidents)
    # We slice the last 2000 entries (which are usually the most recent or representative)
    sliced_hotspots = hotspots[-2000:]

    # Prepare final output structure
    output_data = {
        "kpis": {
            "total_incidents": total_incidents,
            "active_incidents": active_incidents,
            "high_priority_incidents": high_priority_incidents,
            "road_closures": road_closures,
            "avg_resolution_time_min": overall_avg_res
        },
        "by_cause": cause_data,
        "by_priority": priority_data,
        "by_vehicle_type": veh_data,
        "by_corridor": corridor_data,
        "by_zone": zone_data,
        "hourly_trend": hourly_trend,
        "monthly_trend": monthly_trend,
        "avg_res_by_cause": [{"name": c.replace('_', ' ').title(), "minutes": val} for c, val in sorted(avg_res_by_cause.items(), key=lambda x: x[1], reverse=True)],
        "closures_by_cause": [{"name": c.replace('_', ' ').title(), "value": val} for c, val in closures_by_cause.items()],
        "hotspots": sliced_hotspots
    }

    # Ensure parent output directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as out_f:
        json.dump(output_data, out_f, indent=2)

    print(f"Successfully processed {total_incidents} incidents.")
    print(f"Generated analytics data JSON with {len(sliced_hotspots)} hotspots. Saved to {OUTPUT_PATH}")

if __name__ == '__main__':
    main()
