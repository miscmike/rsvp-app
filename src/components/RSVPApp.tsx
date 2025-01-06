"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

interface Submission {
  name: string;
  drawing: string;
}

const RSVPApp = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 300;
    canvas.height = 300;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.strokeStyle = color;
    context.lineWidth = 3;
    context.lineCap = "round";

    // Set white background
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    contextRef.current = context;
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context || !canvas) return;

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (contextRef.current) {
      contextRef.current.strokeStyle = newColor;
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !canvasRef.current) {
      alert("Please enter your name and draw something");
      return;
    }

    const drawing = canvasRef.current.toDataURL("image/png");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, drawing }),
      });

      if (!response.ok) throw new Error("Failed to submit RSVP");

      // Fetch updated submissions
      fetchSubmissions();

      // Clear form
      setName("");
      clearCanvas();
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Failed to submit RSVP. Please try again.");
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/rsvp");
      if (!response.ok) throw new Error("Failed to fetch RSVPs");
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-pink-100 to-purple-200 py-12">
      <div className="max-w-4xl mx-auto p-4 space-y-8 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-200 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/4 right-0 w-24 h-24 bg-pink-200 rounded-full opacity-20 translate-x-1/2" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-200 rounded-full opacity-20 translate-y-1/2" />
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-purple-900">
              RSVP to the Party!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/50 border-purple-200 focus:border-purple-400"
              />
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <Palette className="h-5 w-5 text-purple-600" />
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor: color === c ? "#9333ea" : "transparent",
                      }}
                      onClick={() => handleColorChange(c)}
                    />
                  ))}
                </div>
              </div>

              <div className="border-2 border-purple-200 rounded-lg p-2 bg-white">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full cursor-crosshair"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={clearCanvas}
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50"
                >
                  Clear Drawing
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Submit RSVP
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {submissions.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-purple-900">
                Gallery of RSVPs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {submissions.map((submission, index) => (
                  <div
                    key={index}
                    className="bg-white/50 rounded-lg p-4 shadow-md"
                  >
                    <h3 className="font-medium mb-2 text-purple-900">
                      {submission.name}
                    </h3>
                    <img
                      src={submission.drawing}
                      alt={`Drawing by ${submission.name}`}
                      className="w-full rounded-md"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RSVPApp;
