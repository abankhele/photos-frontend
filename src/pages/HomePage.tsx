"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Feature component with scroll animation and image instead of icon
const FeatureCard = ({ title, description, index, image }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="w-full max-w-3xl mx-auto mb-16"
    >
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-48 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-2/3">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">{description}</p>
            </CardContent>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Parallax Banner component
const ParallaxBanner = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="h-96 w-full relative overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-parallax bg-cover bg-center"
      />
      <div className="absolute inset-0 bg-blue-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-black text-center p-6"
        >
          <h2 className="text-4xl font-bold mb-4">Your Photos Journey</h2>
          <p className="text-xl max-w-2xl">Discover a new way to experience your memories</p>
        </motion.div>
      </div>
    </div>
  );
};

// Scroll Progress Indicator
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: false });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      title: "Secure Cloud Storage",
      description: "Your memories are precious. That's why we use bank-level encryption to ensure your photos are safe and accessible only to you and those you choose to share with.",
      image: "src/assets/images/secure-storage.jpg"
    },
    {
      title: "Smart Search Capabilities",
      description: "Simply type what you're looking for - 'beach sunset', 'dad's birthday', or even 'red dress' - and our AI will instantly find matching photos from your collection.",
      image: "src/assets/images/smart-search.jpg"
    },
    {
      title: "Cross-Device Synchronization",
      description: "Access your entire photo library seamlessly across all your devices. Take a photo on your phone and see it instantly on your computer or tablet.",
      image: "src/assets/images/sync-devices.jpeg"
    },
    {
      title: "Collaborative Albums",
      description: "Create shared albums with friends and family where everyone can contribute their photos, ensuring you never miss a moment from group events.",
      image: "src/assets/images/collaborative-albums.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ScrollProgress />

      {/* Hero Section with Animated Elements */}
      <section ref={heroRef} className="flex flex-col items-center justify-center text-center min-h-screen px-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </motion.div>

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100"
          >
            Your Photos, <span className="text-blue-600">Safe & Organized</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto"
          >
            Securely store and access your photos from anywhere, with powerful AI-driven organization that makes finding memories a breeze.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
              Get Started Free
            </button>
            <button className="px-8 py-3 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Take a Tour
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Parallax Banner */}
      <ParallaxBanner />

      {/* Features Section with Scroll Animations */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover how our platform transforms the way you manage and experience your photo collection
            </p>
          </motion.div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                index={index}
                image={feature.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to organize your photo collection?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of users who have transformed their digital memories experience.</p>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-gray-100 transition-colors text-lg font-medium">
              Start Your Free Trial
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-lg">&copy; {new Date().getFullYear()} Google Photos Clone. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
