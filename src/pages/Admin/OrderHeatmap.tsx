
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isWithinInterval } from "date-fns";
import { Calendar } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

// Mock data generator that respects the date range
const generateMockData = (dateRange: DateRange | undefined) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const data = [];

  // If no date range is selected, return empty data
  if (!dateRange?.from || !dateRange?.to) {
    return [];
  }

  // Generate data only for the selected date range
  let currentDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);

  while (currentDate <= endDate) {
    const dayIndex = currentDate.getDay();
    // Sunday is 0 in getDay(), but we want Monday as 0
    const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;

    for (let hour = 0; hour < 24; hour++) {
      const orderCount = Math.floor(Math.random() * 50); // Random order count between 0-50
      data.push({
        day: days[adjustedDayIndex],
        hour,
        date: new Date(currentDate),
        orders: orderCount,
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const colorScale = [
  '#F2FCE2', // Lightest - Few orders
  '#E5DEFF',
  '#D3E4FD',
  '#9b87f5',
  '#7E69AB',
  '#6E59A5', // Darkest - Many orders
];

const getColorForValue = (value: number, maxValue: number) => {
  const normalizedValue = value / maxValue;
  const colorIndex = Math.floor(normalizedValue * (colorScale.length - 1));
  return colorScale[colorIndex];
};

const OrderHeatmap = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const { data: orderData = [] } = useQuery({
    queryKey: ['orderHeatmap', dateRange],
    queryFn: async () => {
      // In production, fetch from API with date range:
      // const response = await fetch(`/api/analytics/order-activity?from=${dateRange?.from}&to=${dateRange?.to}`);
      // return response.json();
      return generateMockData(dateRange);
    },
    enabled: !!dateRange?.from && !!dateRange?.to,
  });

  const maxOrders = Math.max(...orderData.map((item) => item.orders));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p className="font-medium">{data.day}</p>
          <p>Date: {format(data.date, 'MMM dd, yyyy')}</p>
          <p>Time: {format(new Date().setHours(data.hour), 'h:mm a')}</p>
          <p className="text-primary">Orders: {data.orders}</p>
        </div>
      );
    }
    return null;
  };

  const findPeakOrderTime = () => {
    if (orderData.length === 0) return null;
    
    const peak = orderData.reduce((max, current) => 
      current.orders > max.orders ? current : max
    , orderData[0]);

    return {
      day: peak.day,
      date: peak.date,
      time: format(new Date().setHours(peak.hour), 'h:mm a'),
      orders: peak.orders,
    };
  };

  const peak = findPeakOrderTime();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Order Activity Heatmap</h1>
          <p className="text-gray-500">Visualize order patterns across days and times</p>
        </div>
        <DatePickerWithRange 
          date={dateRange} 
          onDateChange={setDateRange}
        />
      </div>

      {peak && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Peak Order Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">
                  {peak.day} ({format(peak.date, 'MMM dd')}) at {peak.time}
                </p>
                <p className="text-sm text-gray-500">{peak.orders} orders</p>
              </div>
              <Button variant="outline">View Details</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          {orderData.length > 0 ? (
            <ScatterChart
              width={800}
              height={400}
              margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
            >
              <XAxis
                type="number"
                dataKey="hour"
                name="Hour"
                domain={[0, 23]}
                tickFormatter={(hour) => format(new Date().setHours(hour), 'h a')}
              />
              <YAxis
                type="category"
                dataKey="day"
                name="Day"
              />
              <ZAxis
                type="number"
                dataKey="orders"
                range={[0, 500]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={orderData}>
                {orderData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={getColorForValue(entry.orders, maxOrders)}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-gray-500">
              Please select a date range to view the heatmap
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHeatmap;
