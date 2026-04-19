"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a data documentation expert. Generate a comprehensive data dictionary and metadata documentation for the following dataset.\n\nDataset: ${input}\n\nProvide:\n1. Data dictionary with column name, data type, description, allowed values/range, nullability, sample values\n2. Table-level metadata (source system, refresh frequency, owner, retention policy)\n3. Business definitions for key fields\n4. Data quality metrics and completeness stats\n5. Related tables and join keys\n6. Change history/version notes\n\nFormat as structured markdown documentation.`,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result || data.content || "");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-blue-400 mb-3">
          📋 AI Data Dictionary & Metadata Generator
        </h1>
        <p className="text-gray-400 text-lg">
          Describe your dataset and get comprehensive data dictionary and metadata documentation automatically.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Dataset Description
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Describe your dataset...\n\nExample: A user_events table in PostgreSQL. Columns: user_id (UUID), event_type (varchar), event_timestamp (timestamptz), metadata (jsonb), session_id (varchar). Source: Kafka consumer, refreshes every 5 minutes. Owner: Data Engineering team.`}
          className="w-full h-48 p-4 bg-gray-800/60 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !input.trim()}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors duration-200"
      >
        {loading ? "Generating..." : "Generate Documentation"}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Data Dictionary</h2>
          <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
            <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono leading-relaxed">
              {result}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}
