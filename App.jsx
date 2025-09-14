import { useState, useEffect } from "react";

const videoSolutions = {
  clutch: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  brakes: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  engine: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  transmission: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  battery: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  cooling: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  suspension: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  exhaust: "https://www.youtube.com/embed/dQw4w9WgXcQ"
};

const commonIssues = [
  { name: "Engine", severity: "high", avgCost: 3500 },
  { name: "Brakes", severity: "high", avgCost: 2000 },
  { name: "Clutch", severity: "medium", avgCost: 4000 },
  { name: "Battery", severity: "low", avgCost: 800 },
  { name: "Transmission", severity: "high", avgCost: 5500 },
  { name: "Cooling", severity: "medium", avgCost: 2500 },
  { name: "Suspension", severity: "medium", avgCost: 3000 },
  { name: "Exhaust", severity: "low", avgCost: 1500 }
];

const emergencyContacts = [
  { name: "24/7 Towing Service", phone: "+91-9876543210", type: "towing" },
  { name: "Emergency Mechanic", phone: "+91-9876543211", type: "mechanic" },
  { name: "Roadside Assistance", phone: "+91-9876543212", type: "roadside" }
];

function App() {
  const [user, setUser] = useState(null);
  const [issue, setIssue] = useState("");
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedVehicle, setSelectedVehicle] = useState("car");
  const [urgencyLevel, setUrgencyLevel] = useState("normal");
  const [showProfile, setShowProfile] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [searchHistory, setSearchHistory] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(sessionStorage.getItem('user') || 'null');
    const savedHistory = JSON.parse(sessionStorage.getItem('history') || '[]');
    if (savedUser) setUser(savedUser);
    if (savedHistory) setHistory(savedHistory);
  }, []);

  useEffect(() => {
    if (user) sessionStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  const handleLogin = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const userData = { 
      name: form.get("name"), 
      email: form.get("email"),
      phone: form.get("phone"),
      vehicle: form.get("vehicle"),
      joinDate: new Date().toLocaleDateString()
    };
    setUser(userData);
  };

  const handleSearch = () => {
    if (!issue.trim()) return;
    
    const baselineCosts = {
      engine: 3500, brakes: 2000, clutch: 4000, battery: 800,
      transmission: 5500, cooling: 2500, suspension: 3000, exhaust: 1500
    };
    
    const baseCost = baselineCosts[issue.toLowerCase()] || Math.floor(Math.random() * 3000) + 1000;
    const urgencyMultiplier = urgencyLevel === "emergency" ? 1.5 : urgencyLevel === "urgent" ? 1.2 : 1;
    const costEstimate = Math.floor(baseCost * urgencyMultiplier);
    
    const newEntry = {
      id: Date.now(),
      issue: issue.toLowerCase(),
      cost: costEstimate,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      vehicle: selectedVehicle,
      urgency: urgencyLevel,
      status: "pending",
      severity: getSeverity(issue.toLowerCase())
    };
    
    setHistory([newEntry, ...history]);
    setIssue("");
  };

  const getSeverity = (issue) => {
    const highSeverity = ["engine", "brakes", "transmission"];
    const mediumSeverity = ["clutch", "cooling", "suspension"];
    return highSeverity.includes(issue) ? "high" : mediumSeverity.includes(issue) ? "medium" : "low";
  };

  const updateIssueStatus = (id, status) => {
    setHistory(history.map(h => h.id === id ? { ...h, status } : h));
  };

  const deleteIssue = (id) => {
    setHistory(history.filter(h => h.id !== id));
  };

  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    sessionStorage.clear();
    setActiveTab("dashboard");
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved": return "#10b981";
      case "in-progress": return "#f59e0b";
      case "pending": return "#6b7280";
      default: return "#6b7280";
    }
  };

  const filteredHistory = history.filter(h => {
    const severityMatch = filterSeverity === "all" || h.severity === filterSeverity;
    const searchMatch = searchHistory === "" || 
      h.issue.toLowerCase().includes(searchHistory.toLowerCase()) ||
      h.vehicle.toLowerCase().includes(searchHistory.toLowerCase());
    return severityMatch && searchMatch;
  });

  if (!user) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem"
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          padding: "2.5rem",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚗</div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>
              Vehicle Fix Assistant
            </h1>
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Your trusted companion for vehicle maintenance
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              required
              style={{
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: "2px solid #e5e7eb",
                fontSize: "1rem",
                outline: "none"
              }}
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              style={{
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: "2px solid #e5e7eb",
                fontSize: "1rem",
                outline: "none"
              }}
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              required
              style={{
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: "2px solid #e5e7eb",
                fontSize: "1rem",
                outline: "none"
              }}
            />
            <select
              name="vehicle"
              required
              style={{
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: "2px solid #e5e7eb",
                fontSize: "1rem",
                backgroundColor: "white"
              }}
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="truck">Truck</option>
              <option value="suv">SUV</option>
            </select>
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                padding: "0.875rem",
                border: "none",
                borderRadius: "0.75rem",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
              }}
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "white",
        padding: "1rem 2rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ fontSize: "2rem" }}>🚗</div>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                Vehicle Fix Assistant
              </h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: "0.9rem" }}>
                Welcome back, {user.name}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                color: "white",
                cursor: "pointer"
              }}
            >
              👤 Profile
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                color: "white",
                cursor: "pointer"
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            borderRadius: "1rem",
            padding: "2rem",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem" }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><strong>Name:</strong> {user.name}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Phone:</strong> {user.phone}</div>
              <div><strong>Vehicle:</strong> {user.vehicle}</div>
              <div><strong>Member since:</strong> {user.joinDate}</div>
              <div><strong>Total Issues:</strong> {history.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "1rem 2rem"
      }}>
        <div style={{ display: "flex", gap: "2rem" }}>
          {[
            { id: "dashboard", label: "📊 Dashboard" },
            { id: "report", label: "🔧 Report Issue" },
            { id: "history", label: "📋 History" },
            { id: "emergency", label: "🚨 Emergency" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? "#667eea" : "transparent",
                color: activeTab === tab.id ? "white" : "#6b7280",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "2rem" }}>
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem", color: "#1f2937" }}>
              Dashboard
            </h2>
            
            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
              <div style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                padding: "1.5rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, opacity: 0.9 }}>Total Issues</p>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>{history.length}</p>
                  </div>
                  <div style={{ fontSize: "2rem" }}>🔧</div>
                </div>
              </div>
              
              <div style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "white",
                padding: "1.5rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, opacity: 0.9 }}>Total Spent</p>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
                      ₹{history.reduce((sum, h) => sum + h.cost, 0).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ fontSize: "2rem" }}>💰</div>
                </div>
              </div>
              
              <div style={{
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "white",
                padding: "1.5rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, opacity: 0.9 }}>Resolved Issues</p>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
                      {history.filter(h => h.status === "resolved").length}
                    </p>
                  </div>
                  <div style={{ fontSize: "2rem" }}>✅</div>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div style={{
              background: "white",
              borderRadius: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              padding: "1.5rem"
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#1f2937" }}>
                Common Vehicle Issues
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {commonIssues.map((issue, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "1rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      cursor: "pointer",
                      borderLeft: `4px solid ${getSeverityColor(issue.severity)}`
                    }}
                    onClick={() => {
                      setIssue(issue.name.toLowerCase());
                      setActiveTab("report");
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: "500" }}>{issue.name}</span>
                      <span style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        color: "white",
                        background: getSeverityColor(issue.severity)
                      }}>
                        {issue.severity}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
                      Avg. Cost: ₹{issue.avgCost.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Report Issue Tab */}
        {activeTab === "report" && (
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem", color: "#1f2937" }}>
              Report Vehicle Issue
            </h2>
            
            <div style={{
              background: "white",
              borderRadius: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              padding: "2rem"
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                <div>
                  <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem", color: "#374151" }}>
                    Issue Description
                  </label>
                  <input
                    value={issue}
                    onChange={(e) => setIssue(e.target.value.toLowerCase())}
                    placeholder="e.g. engine overheating, brake noise"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      border: "2px solid #e5e7eb",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                  />
                  
                  <label style={{ display: "block", fontWeight: "500", marginTop: "1rem", marginBottom: "0.5rem", color: "#374151" }}>
                    Vehicle Type
                  </label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      border: "2px solid #e5e7eb",
                      fontSize: "1rem",
                      backgroundColor: "white"
                    }}
                  >
                    <option value="car">Car</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="truck">Truck</option>
                    <option value="suv">SUV</option>
                  </select>
                  
                  <label style={{ display: "block", fontWeight: "500", marginTop: "1rem", marginBottom: "0.5rem", color: "#374151" }}>
                    Urgency Level
                  </label>
                  <select
                    value={urgencyLevel}
                    onChange={(e) => setUrgencyLevel(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      border: "2px solid #e5e7eb",
                      fontSize: "1rem",
                      backgroundColor: "white"
                    }}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent (+20% cost)</option>
                    <option value="emergency">Emergency (+50% cost)</option>
                  </select>
                  
                  <button
                    onClick={handleSearch}
                    disabled={!issue.trim()}
                    style={{
                      width: "100%",
                      background: issue.trim() ? "linear-gradient(135deg, #667eea, #764ba2)" : "#d1d5db",
                      color: "white",
                      padding: "0.875rem",
                      border: "none",
                      borderRadius: "0.75rem",
                      cursor: issue.trim() ? "pointer" : "not-allowed",
                      fontWeight: "600",
                      fontSize: "1rem",
                      marginTop: "1.5rem"
                    }}
                  >
                    🔍 Find Solution
                  </button>
                </div>
                
                {/* Video Solution */}
                {issue && videoSolutions[issue.toLowerCase()] && (
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
                      Solution Video for {issue.charAt(0).toUpperCase() + issue.slice(1)}
                    </h3>
                    <iframe
                      style={{ 
                        width: "100%", 
                        height: "300px", 
                        borderRadius: "0.75rem",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                      }}
                      src={videoSolutions[issue.toLowerCase()]}
                      title="Fix Video"
                      allowFullScreen
                    />
                    <div style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      background: "#fef3c7",
                      borderRadius: "0.75rem",
                      borderLeft: "4px solid #f59e0b"
                    }}>
                      <p style={{ margin: 0, color: "#92400e", fontSize: "0.9rem" }}>
                        ⚠️ If the video solution doesn't resolve your issue, we recommend visiting a professional mechanic.
                      </p>
                      <a
                        href="https://www.google.com/maps/search/garage+near+me"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#667eea",
                          textDecoration: "none",
                          fontWeight: "500",
                          marginTop: "0.5rem",
                          display: "block"
                        }}
                      >
                        📍 Find nearby garage
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>
                Issue History
              </h2>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <input
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  placeholder="Search history..."
                  style={{
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    outline: "none"
                  }}
                />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white"
                  }}
                >
                  <option value="all">All Severity</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            
            {filteredHistory.length === 0 ? (
              <div style={{
                background: "white",
                borderRadius: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                padding: "3rem",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
                <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>No issues found matching your criteria</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {filteredHistory.map((h) => (
                  <div
                    key={h.id}
                    style={{
                      background: "white",
                      borderRadius: "1rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      padding: "1.5rem",
                      borderLeft: `4px solid ${getSeverityColor(h.severity)}`
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                      <div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "600", margin: "0 0 0.5rem 0", color: "#1f2937" }}>
                          {h.issue.charAt(0).toUpperCase() + h.issue.slice(1)} Issue
                        </h3>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                          <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                            📅 {h.date} at {h.time}
                          </span>
                          <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                            🚗 {h.vehicle.charAt(0).toUpperCase() + h.vehicle.slice(1)}
                          </span>
                          <span style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            color: "white",
                            background: getSeverityColor(h.severity)
                          }}>
                            {h.severity.toUpperCase()} SEVERITY
                          </span>
                          <span style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            color: "white",
                            background: getStatusColor(h.status)
                          }}>
                            {h.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1f2937" }}>
                          ₹{h.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {h.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateIssueStatus(h.id, "in-progress")}
                            style={{
                              background: "#f59e0b",
                              color: "white",
                              border: "none",
                              padding: "0.5rem 1rem",
                              borderRadius: "0.5rem",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "500"
                            }}
                          >
                            Mark In Progress
                          </button>
                          <button
                            onClick={() => updateIssueStatus(h.id, "resolved")}
                            style={{
                              background: "#10b981",
                              color: "white",
                              border: "none",
                              padding: "0.5rem 1rem",
                              borderRadius: "0.5rem",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "500"
                            }}
                          >
                            Mark Resolved
                          </button>
                        </>
                      )}
                      {h.status === "in-progress" && (
                        <button
                          onClick={() => updateIssueStatus(h.id, "resolved")}
                          style={{
                            background: "#10b981",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.5rem",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: "500"
                          }}
                        >
                          Mark Resolved
                        </button>
                      )}
                      <button
                        onClick={() => deleteIssue(h.id)}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          padding: "0.5rem 1rem",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: "500"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Emergency Tab */}
        {activeTab === "emergency" && (
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem", color: "#dc2626" }}>
              Emergency Contacts
            </h2>
            
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "1rem",
              padding: "1.5rem",
              marginBottom: "2rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "1.5rem" }}>⚠️</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#dc2626", margin: 0 }}>
                  Emergency Guidelines
                </h3>
              </div>
              <ul style={{ color: "#7f1d1d", margin: 0, paddingLeft: "1.5rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>If your vehicle has broken down in a dangerous location, call emergency services first (112)</li>
                <li style={{ marginBottom: "0.5rem" }}>For non-life-threatening breakdowns, use the contacts below</li>
                <li style={{ marginBottom: "0.5rem" }}>Always prioritize safety over vehicle repairs</li>
                <li>Keep your location and vehicle details ready when calling</li>
              </ul>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {emergencyContacts.map((contact, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    borderRadius: "1rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    padding: "1.5rem",
                    border: "2px solid #fee2e2"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1f2937", margin: 0 }}>
                      {contact.name}
                    </h3>
                    <span style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      background: "#dc2626",
                      color: "white"
                    }}>
                      {contact.type.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "1.25rem" }}>📞</div>
                    <span style={{ fontSize: "1.1rem", fontWeight: "500", color: "#1f2937" }}>
                      {contact.phone}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <a
                      href={`tel:${contact.phone}`}
                      style={{
                        background: "#dc2626",
                        color: "white",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "0.75rem",
                        textDecoration: "none",
                        fontWeight: "500"
                      }}
                    >
                      📞 Call Now
                    </a>
                    <a
                      href={`sms:${contact.phone}`}
                      style={{
                        background: "#f3f4f6",
                        color: "#374151",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "0.75rem",
                        textDecoration: "none",
                        fontWeight: "500",
                        border: "1px solid #d1d5db"
                      }}
                    >
                      💬 SMS
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{
              background: "white",
              borderRadius: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              padding: "1.5rem",
              marginTop: "2rem"
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
                Quick Location Share
              </h3>
              <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                Share your current location with emergency services or mechanics for faster assistance.
              </p>
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords;
                        const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
                        navigator.clipboard.writeText(locationUrl);
                        alert("Location copied to clipboard! You can now share it via SMS or call.");
                      },
                      (error) => {
                        alert("Unable to get location. Please share your location manually.");
                      }
                    );
                  } else {
                    alert("Geolocation is not supported by this browser.");
                  }
                }}
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                📍 Share My Location
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
