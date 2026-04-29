
import React from 'react';
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Building2, ExternalLink, FileText, Users, Shield } from "lucide-react";

export default function GovtSchemes() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Building2 className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Government Schemes 2025</h1>
            <p className="text-xl text-brand-100 mb-8 max-w-3xl mx-auto">
              Discover the latest government schemes and programs designed to empower workers, 
              enhance skills, and boost employment opportunities across India.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Coming Soon</h2>
            <p className="text-xl text-gray-600">
              We're working on bringing you comprehensive information about government schemes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <FileText className="w-12 h-12 text-brand-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Skill Development</h3>
              <p className="text-gray-600 mb-4">Training programs and certification courses</p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <Users className="w-12 h-12 text-brand-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Employment Programs</h3>
              <p className="text-gray-600 mb-4">Job creation and startup support</p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <Shield className="w-12 h-12 text-brand-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Financial Assistance</h3>
              <p className="text-gray-600 mb-4">Loans, subsidies, and financial support</p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Card className="p-8 bg-blue-50">
              <h3 className="text-2xl font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-600 mb-6">
                We're preparing detailed information about various government schemes. 
                Check back soon for updates.
              </p>
              <Button className="bg-brand-600 hover:bg-brand-700">
                Get Notified
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
