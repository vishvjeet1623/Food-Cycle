import React from 'react';
import { ArrowRight, UtensilsCrossed, Heart, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Meals Saved', value: '50,000+' },
  { label: 'NGOs Partnered', value: '100+' },
  { label: 'Food Donated (kg)', value: '25,000+' },
];

const features = [
  {
    icon: UtensilsCrossed,
    title: 'Restaurants & Hotels',
    description: 'Easily donate surplus food and track your impact on the community.',
  },
  {
    icon: Heart,
    title: 'NGOs & Shelters',
    description: 'Find and request available food donations in your area.',
  },
  {
    icon: Truck,
    title: 'Volunteer Drivers',
    description: 'Help deliver food to those who need it most.',
  },
];

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Food donation"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Connecting Surplus Food<br />with Those in Need
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Join our mission to reduce food waste and fight hunger. FoodCycle connects restaurants
            and food businesses with local NGOs and shelters to ensure no good food goes to waste.
          </p>
          <div className="mt-10">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-2 text-lg font-medium text-green-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How FoodCycle Works
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Join our community and make a difference in three simple steps
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;