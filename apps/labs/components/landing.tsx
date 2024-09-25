"use client";

import { motion, scroll, Variants } from "framer-motion";
import { Button } from "@ui/components/ui/button";
import {
  Moon,
  Sun,
  Code,
  Globe,
  Zap,
  Users,
  ChevronRight,
  Server,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggler from "./themeToggler";

export default function LandingPage() {
  const router = useRouter();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center ">
        <motion.div
          className="flex items-center cursor-pointer space-x-2"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          onClick={() => router.replace("/")}
        >
          <Code className="h-8 w-8 text-red-500" />
          <span className="text-2xl font-extrabold tracking-tight">
            CodingLabs
          </span>
        </motion.div>
        <nav className="hidden md:flex space-x-8">
          {["Features", "Languages", "Pricing"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium hover:text-red-500 transition-colors"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </nav>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex items-center gap-5"
        >
          <ThemeToggler />
          <Button>Login</Button>
        </motion.div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <motion.section
          className="text-center mb-24"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
            variants={itemVariants}
          >
            Code Anywhere, <span className="text-red-500">Anytime</span>
          </motion.h1>
          <motion.p
            className="text-xl mb-12 max-w-2xl mx-auto text-gray-600 dark:text-gray-300"
            variants={itemVariants}
          >
            Experience the future of coding with CodingLabs. Write and run code
            in multiple languages, all in your browser.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Start Coding Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.section>

        <motion.section
          id="features"
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl font-bold mb-12 text-center"
            variants={itemVariants}
          >
            Why Choose CodingLabs?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Globe,
                title: "Multiple Languages",
                description:
                  "Code in your favorite language. We support a wide range of programming languages.",
              },
              {
                icon: Zap,
                title: "Instant Execution",
                description:
                  "Run your code instantly in the cloud. No setup or installation required.",
              },
              {
                icon: Server,
                title: "Cloud based IDE",
                description: "Access your projects from anywhere, anytime.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex flex-col items-center text-center shadow rounded-md dark:bg-gray-800 bg-gray-300 py-10 px-5"
                variants={itemVariants}
              >
                <feature.icon className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="languages"
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl font-bold mb-12 text-center"
            variants={itemVariants}
          >
            Supported Languages
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Python",
              "JavaScript",
              "Java",
              "C++",
              "Ruby",
              "Go",
              "Rust",
              "PHP",
            ].map((lang, index) => (
              <motion.div
                key={lang}
                className="bg-gray-300 shadow dark:bg-gray-800 p-4 rounded-lg text-center font-medium"
                variants={itemVariants}
              >
                {lang}
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="pricing"
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl font-bold mb-6"
            variants={itemVariants}
          >
            Start Coding Today
          </motion.h2>
          <motion.p
            className="text-xl mb-12 max-w-2xl mx-auto text-gray-600 dark:text-gray-300"
            variants={itemVariants}
          >
            Join thousands of developers who trust CodingLabs for their coding
            needs. Get started for free!
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Sign Up for Free
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.section>
      </main>

      <footer className="bg-gray-300 dark:bg-gray-800 text-center py-8 mt-24">
        <p className="text-gray-600 dark:text-gray-300">
          &copy; 2023 CodingLabs. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
