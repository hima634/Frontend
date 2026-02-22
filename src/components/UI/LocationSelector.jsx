import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { State, City } from "country-state-city";
import axios from "axios";

export default function LocationSelector({ onLocationChange }) {
  const [mode, setMode] = useState("");

  const [locationData, setLocationData] = useState({
    stateCode: "",
    state: "",
    city: "",
    zipcode: "",
    neighbourhood: "",
    lat: "",
    lng: "",
  });

  // ================= MATCH STATE NAME -> CODE =================
  const matchStateCode = (stateName) => {
    if (!stateName) return "";

    const states = State.getStatesOfCountry("IN");
    const matched = states.find(
      (st) => st.name.toLowerCase() === stateName.toLowerCase()
    );

    return matched ? matched.isoCode : "";
  };

  // ================= GET STATE NAME FROM CODE =================
  const getStateName = (code) => {
    const state = State.getStateByCodeAndCountry(code, "IN");
    return state ? state.name : "";
  };

  // ================= GPS FETCH =================
  const fetchLocationFromGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const address = res.data.address || {};
        const stateCode = matchStateCode(address.state);

        const updated = {
          lat,
          lng,
          stateCode,
          state: address.state || "",
          city:
            address.city ||
            address.town ||
            address.village ||
            address.state_district ||
            "",
          zipcode: address.postcode || "",
          neighbourhood:
            address.suburb || address.neighbourhood || address.village ||address.locality || "",
        };

        setLocationData(updated);
        onLocationChange && onLocationChange(updated);
        alert("Location auto-filled from GPS ✅");
      } catch {
        alert("Location fetched but address not resolved");
      }
    });
  };

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const updated = { ...locationData, [e.target.name]: e.target.value };
    setLocationData(updated);
    onLocationChange && onLocationChange(updated);
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <FaMapMarkerAlt /> Location
      </h2>

      {/* MODE BUTTONS */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setMode("gps");
            fetchLocationFromGPS();
          }}
          className={`w-1/2 py-3 rounded-lg font-bold ${
            mode === "gps" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          📍 Fetch Location
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("manual");
            const cleared = {
              stateCode: "",
              state: "",
              city: "",
              zipcode: "",
              neighbourhood: "",
              lat: "",
              lng: "",
            };
            setLocationData(cleared);
            onLocationChange && onLocationChange(cleared);
          }}
          className={`w-1/2 py-3 rounded-lg font-bold ${
            mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          ✍ Enter Manually
        </button>
      </div>

      {/* ================= GPS MODE ================= */}
      {mode === "gps" && (
        <>
          <input readOnly value={locationData.state} placeholder="State" className="w-full p-3 border rounded-lg bg-gray-100" />
          <input readOnly value={locationData.city} placeholder="City" className="w-full p-3 border rounded-lg bg-gray-100" />
          <input readOnly value={locationData.zipcode} placeholder="Zipcode" className="w-full p-3 border rounded-lg bg-gray-100" />
          <input readOnly value={locationData.neighbourhood} placeholder="Neighbourhood" className="w-full p-3 border rounded-lg bg-gray-100" />
        </>
      )}

      {/* ================= MANUAL MODE ================= */}
      {mode === "manual" && (
        <>
          {/* State */}
          <select
            name="stateCode"
            value={locationData.stateCode}
            onChange={(e) => {
              const code = e.target.value;
              const stateName = getStateName(code);

              const updated = {
                ...locationData,
                stateCode: code,
                state: stateName, // ✅ important fix
                city: "",
              };

              setLocationData(updated);
              onLocationChange && onLocationChange(updated);
            }}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select State</option>
            {State.getStatesOfCountry("IN").map((st) => (
              <option key={st.isoCode} value={st.isoCode}>
                {st.name}
              </option>
            ))}
          </select>

          {/* City */}
          {locationData.stateCode && (
            <select
              name="city"
              value={locationData.city}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select City</option>
              {City.getCitiesOfState("IN", locationData.stateCode).map((ct) => (
                <option key={ct.name} value={ct.name}>
                  {ct.name}
                </option>
              ))}
            </select>
          )}

          <input
            name="zipcode"
            value={locationData.zipcode}
            onChange={handleChange}
            placeholder="Enter Zipcode"
            className="w-full p-3 border rounded-lg"
          />

          <input
            name="neighbourhood"
            value={locationData.neighbourhood}
            onChange={handleChange}
            placeholder="Enter neighbourhood"
            className="w-full p-3 border rounded-lg"
          />
        </>
      )}
    </section>
  );
}
