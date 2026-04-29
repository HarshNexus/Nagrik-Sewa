import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Construction, ArrowRight } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  suggestion?: string;
}

export default function Placeholder({ title, description, suggestion }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-xl text-gray-600 mb-8">{description}</p>
            {suggestion && (
              <p className="text-gray-500 mb-6">{suggestion}</p>
            )}
            <Button className="bg-brand-500 hover:bg-brand-600">
              Continue Building This Page
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
