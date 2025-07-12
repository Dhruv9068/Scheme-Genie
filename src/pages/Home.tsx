import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Bot, FileText, Bell, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ExtensionBanner } from '../components/home/ExtensionBanner';

export const Home: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Automation',
      description: 'Our AI automatically fills complex government forms based on simple questions you answer',
      color: 'from-orange-400 to-orange-600',
    },
    {
      icon: FileText,
      title: 'Smart Form Filling',
      description: 'No more manual form filling - just chat with our AI and get your applications ready',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Zap,
      title: 'Instant Matching',
      description: 'Get matched to the perfect schemes in seconds based on your profile and needs',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Automated deadline tracking and email reminders so you never miss an opportunity',
      color: 'from-green-400 to-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-cream-50 bg-grid-pattern bg-grid grid-hover-effect">
      {/* Orange glow animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-radial from-orange-200/30 to-transparent rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-40 w-60 h-60 bg-gradient-radial from-orange-300/20 to-transparent rounded-full"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 grid-hover-effect">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-24 h-24 mx-auto mb-8 bg-white rounded-full shadow-lg border-2 border-orange-200 flex items-center justify-center animate-float">
                <img src="/Logo.png" alt="SchemeGenie" className="w-16 h-16 p-2" />
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                Stop Filling Forms
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                  Start Getting Benefits
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Our AI automatically fills government benefit applications for you. 
                Just answer simple questions and get matched to perfect schemes worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.location.href = '/assistant'}
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg"
                >
                  Start with AI Assistant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => window.location.href = '/schemes'}
                  variant="secondary"
                  size="lg"
                  className="text-lg px-8 py-4 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 rounded-xl"
                >
                  Browse Schemes
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-white/80 backdrop-blur-sm grid-hover-effect">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                The Problem with Current Systems
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 bg-red-50 border-red-200 card-hover-shine">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Complex Forms</h3>
                  <p className="text-gray-600 text-sm">Government forms are confusing, lengthy, and require technical knowledge</p>
                </Card>
                <Card className="p-6 bg-yellow-50 border-yellow-200 card-hover-shine">
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Time Consuming</h3>
                  <p className="text-gray-600 text-sm">Hours spent researching schemes and filling out applications manually</p>
                </Card>
                <Card className="p-6 bg-blue-50 border-blue-200 card-hover-shine">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">High Rejection Rate</h3>
                  <p className="text-gray-600 text-sm">Many applications get rejected due to errors or missing information</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 grid-hover-effect">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How SchemeGenie Solves This
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We use advanced AI to automate the entire process, making benefit applications effortless and successful.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="h-full card-hover-shine">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 mb-4 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Extension Banner */}
        <ExtensionBanner />

        {/* Process Section */}
        <section className="py-20 bg-white/80 backdrop-blur-sm grid-hover-effect">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Simple 3-Step Process
              </h2>
              <p className="text-xl text-gray-600">
                From signup to approved application in minutes, not hours
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Answer Simple Questions',
                  description: 'Tell us about your situation through our conversational AI - no complex forms to fill',
                  icon: Bot,
                },
                {
                  step: '02',
                  title: 'AI Finds & Fills Forms',
                  description: 'Our AI automatically finds matching schemes and fills out all applications for you',
                  icon: Zap,
                },
                {
                  step: '03',
                  title: 'Submit & Track',
                  description: 'Review, submit applications, and get automated reminders for deadlines and updates',
                  icon: FileText,
                },
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="flex items-start space-x-4 card-hover-shine p-6 rounded-xl bg-white/50">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {step.description}
                      </p>
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                        <step.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-700 text-white grid-hover-effect">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Stop Wasting Time on Forms?
              </h2>
              <p className="text-xl text-orange-100 mb-8">
                Join thousands who've automated their benefit applications and got approved faster.
              </p>
              <Button
                onClick={() => window.location.href = '/assistant'}
                size="lg"
                className="text-lg px-8 py-4 bg-white text-orange-600 hover:bg-gray-100 shadow-lg rounded-xl font-semibold"
              >
                Start Automating Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};