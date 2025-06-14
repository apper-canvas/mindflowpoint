import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { routeArray } from "@/config/routes";
import React from "react";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
    {/* Main Content */}
    <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
        <motion.div
            key={location.pathname}
            initial={{
                opacity: 0,
                x: 20
            }}
            animate={{
                opacity: 1,
                x: 0
            }}
            exit={{
                opacity: 0,
                x: -20
            }}
            transition={{
                duration: 0.3
            }}
            className="min-h-full">
            <Outlet />
        </motion.div>
    </main>
    {/* Bottom Navigation */}
    <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40 lg:hidden">
        <div className="flex justify-around items-center max-w-md mx-auto">
            {routeArray.map(route => <NavLink
                key={route.id}
                to={route.path}
                className={(
                    {
                        isActive
                    }
                ) => `flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${isActive ? "text-primary bg-purple-50 scale-105" : "text-gray-500 hover:text-primary hover:bg-purple-50"}`}>
                {(
                    {
                        isActive
                    }
                ) => <>
                    <motion.div
                        whileHover={{
                            scale: 1.1
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        className={`p-1 rounded-lg ${isActive ? "animate-pulse-glow" : ""}`}>
                        <ApperIcon
                            name={route.icon}
                            size={20}
                            className={isActive ? "text-primary" : "text-gray-500"} />
                    </motion.div>
                    <span className="text-xs mt-1 font-medium">
                        {route.label}
                    </span>
                </>}
            </NavLink>)}
        </div>
    </nav>
    {/* Desktop Sidebar */}
    <aside
        className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40">
        <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
                <div
                    className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <ApperIcon name="Brain" size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="font-display font-bold text-xl text-gray-900">MindFlow AI</h1>
                    <p className="text-sm text-gray-500">Wellness Companion</p>
                </div>
            </div>
            <nav className="space-y-2">
                {routeArray.map(route => <NavLink
                    key={route.id}
                    to={route.path}
                    className={(
                        {
                            isActive
                        }
                    ) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-purple-50 text-primary border-r-2 border-primary" : "text-gray-600 hover:bg-purple-50 hover:text-primary"}`}>
                    <ApperIcon name={route.icon} size={20} />
                    <span className="font-medium">{route.label}</span>
                </NavLink>)}
</nav>
        </div>
    </aside>
    
    <style jsx={true}>{`
      @media (min-width: 1024px) {
        main {
          margin-left: 16rem;
          padding-bottom: 1.5rem;
        }
      }
    `}</style>
    </div>
  );
};

export default Layout;