"use client";

import React, { useState, useEffect } from "react";
import { fetchDashboardData } from "@/lib/admin";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Car, Users, Calendar, DollarSign } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalVehicles: 0,
      totalUsers: 0,
      totalReservations: 0,
      totalRevenue: 0,
    },
    revenueData: [],
    dailyRevenue: [],
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1>Dashboard</h1>
      </section>
      <section className="content">
        <div className="row">
          {[
            {
              title: "Total Vehicles",
              value: dashboardData.stats.totalVehicles,
              icon: <Car />,
              color: "bg-info",
            },
            {
              title: "Total Users",
              value: dashboardData.stats.totalUsers,
              icon: <Users />,
              color: "bg-success",
            },
            {
              title: "Total Reservations",
              value: dashboardData.stats.totalReservations,
              icon: <Calendar />,
              color: "bg-warning",
            },
            {
              title: "Total Revenue",
              value: `$${dashboardData.stats.totalRevenue.toLocaleString()}`,
              icon: <DollarSign />,
              color: "bg-danger",
            },
          ].map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        <div className="row mt-4">
          <div className="col-md-12">
            <Card>
              <CardHeader>Revenue Over Time</CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="col-lg-3 col-6">
    <div className={`small-box ${color}`}>
      <div className="inner">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
      <div className="icon">{icon}</div>
    </div>
  </div>
);

export default Dashboard;
