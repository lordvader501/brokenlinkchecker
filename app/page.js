"use client";

import { Container } from "@/components/layout/Container";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState("");
  const [result, setResult] = useState([]);
  const handleLinkSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`api/check`, {
        urls: urls,
      });
      setResult((prev) => [
        ...new Map(
          [...prev, ...response.data].map((item) => [item["url"], item])
        ).values(),
      ]);
    } catch (error) {
      console.error("Error checking links:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="mt-10 flex flex-col items-center">
      <h1 className="w-full text-4xl text-center font-bold">
        Broken Link Checker
      </h1>
      <h4 className="mt-10 mb-2">
        Enter links to find broken and non borken links in url
      </h4>
      <textarea
        placeholder="enter the links in seperate lines"
        className="w-full lg:w-2/3 outline-double rounded px-4 py-2"
        rows={7}
        onChange={(e) =>
          setUrls(e.target.value.replace(" ", " \n").split("\n"))
        }
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
        onClick={handleLinkSearch}
      >
        {loading ? "Checking Links ..." : "Check Links"}
      </button>
      <div className="mt-10 border-2 border-black p-5 rounded-md w-full">
        {loading && <p>Loading ...</p>}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="border-2 border-green-900 bg-green-400 w-full lg:w-1/2 rounded-md p-4 gap-4 flex flex-col">
            <p className="font-bold text-xl">Working Links</p>
            <ul className="w-full flex flex-col gap-4 px-4">
              {result
                .filter((link) => link.status === 200)
                .map((link) => (
                  <Link key={link.url} href={link.url}>
                    <li className="break-words list-disc">{link.url}</li>
                  </Link>
                ))}
            </ul>
          </div>
          <div className="border-2 border-red-900 bg-red-400 w-full lg:w-1/2 gap-4 flex flex-col rounded-md p-4">
            <p className="font-bold text-xl">Broken Links</p>
            <ul className="w-full flex flex-col gap-4 px-4">
              {result
                .filter(
                  (link) =>
                    link.status === 404 &&
                    link.url !== "" &&
                    !link.url.startsWith("javascript:void(0)")
                )
                .map((link) => (
                  <Link key={link.url} href={link.url}>
                    <li className="break-words list-disc">{link.url}</li>
                  </Link>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}
