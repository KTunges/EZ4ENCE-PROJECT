import { useState, useEffect } from 'react';

export default function useVietnamProvinces() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/shipping/ghn/provinces`);
        const data = await res.json();
        setProvinces(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceId) => {
    if (!provinceId) {
      setDistricts([]);
      setWards([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/shipping/ghn/districts?province_id=${provinceId}`);
      const data = await res.json();
      setDistricts(data);
      setWards([]); // reset wards when changing province
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (districtId) => {
    if (!districtId) {
      setWards([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/shipping/ghn/wards?district_id=${districtId}`);
      const data = await res.json();
      setWards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    provinces,
    districts,
    wards,
    fetchDistricts,
    fetchWards,
    loading,
    error
  };
}
