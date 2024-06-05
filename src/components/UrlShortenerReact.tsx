import { useState } from "react";

export default function UrlShortener({ userId }: { userId?: number }) {

  const [url, setUrl] = useState<string>();
  const [customUrl, setCustomUrl] = useState<string>();
  const [shortUrl, setShortUrl] = useState<string>();
  const [isCustom, setIsCustom] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  interface RequestBody {
    url: string;
    userId: number | null;
    isCustom: boolean;
    customUrl?: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!url) {
      return;
    }

    const body: RequestBody = {
      url: url,
      isCustom: isCustom,
      userId: userId ? userId : null,
    };
    
    if (isCustom) {
      body.customUrl = customUrl;
    }
    
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to shorten URL");
      }

      const responseData = await res.text();

      try {
        const data = JSON.parse(responseData);
        setShortUrl(data.shortUrl);
      } catch (jsonError) {
        setError("Invalid response from server");
        console.error(jsonError);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      console.error(error);
    }

  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex items-center">
          <button className={`p-2 block transition  ${isCustom ? 'bg-gray-800' : 'bg-gray-700'} hover:bg-gray-700 text-white rounded-lg mr-2`} onClick={() => setIsCustom(false)}>Short URL</button>
          <button className={`p-2 block transition ${isCustom ? 'bg-gray-700' : 'bg-gray-800'} hover:bg-gray-700 text-white rounded-lg`} onClick={() => setIsCustom(true)}>Custom URL</button>
        </div>
      </div>


      <form className="flex flex-col justify-center items-center h-full mt-2" onSubmit={handleSubmit}>

        <input 
          type="url" 
          className="p-1 block transition bg-gray-700 hover:bg-gray-800 text-white rounded-lg mb-2"
          placeholder="Enter a URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {isCustom && <input 
          type="text" 
          className="p-1 block transition bg-gray-700 hover:bg-gray-800 text-white rounded-lg mb-2"
          placeholder="Enter a custom code"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
        />}

        <button className="p-2 block transition bg-gray-800 hover:bg-gray-700 text-white rounded-lg" type="submit">Shorten</button>
        <p className="text-center text-red-600">{error ? error : ''}</p>
      </form>
    </>

  );
}