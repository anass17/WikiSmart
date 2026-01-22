import React, { useState } from "react";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

const ActionsPage: React.FC = () => {

  const [userName] = useState("John Doe");

  // State for article ingestion
  const [ingestOption, setIngestOption] = useState<"url" | "keyword" | "pdf">("url");
  const [articleInput, setArticleInput] = useState<string | null>("");
  const [ingestedContent, setIngestedContent] = useState<string>("");
  const [ingestedContentId, setIngestedContentId] = useState<number | null>(null);
  const [ingestLoading, setIngestLoading] = useState<boolean>(false);
  const [ingestError, setIngestError] = useState<string>("");

  // State for actions
  const [actionOption, setActionOption] = useState<"summarize" | "quiz" | "translate">("summarize");
  const [actionSubOption, setActionSubOption] = useState<string | number>("court");
  const [actionResult, setActionResult] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string>("");

  // Handlers
  const handleIngest = async (e: any) => {
    e.preventDefault();

    if (ingestOption == "pdf") {
      alert("This option is not available yet")
      return
    }

    setIngestLoading(true)

    const request = await fetch(`${API_URL}/ingest/wikipedia`, {
      method: 'POST',
      headers: {
         "content-type": "application/json"
      },
      body: JSON.stringify({
        method: ingestOption,
        ressource: articleInput
      })
    })

    const response = await request.json()

    if (request.status == 200) {

      setIngestedContent(response.content)
      setIngestedContentId(response.id)
      setIngestError("")

    } else if (request.status == 400) {

      setIngestError(response.detail)

    } else {

      setIngestError("Something went wrong !")
    
    }

    setIngestLoading(false)
  };



  // Handle Action

  const handleAction = async (e: any) => {
    
    e.preventDefault();

    setActionLoading(true)

    let data = {}

    if (actionOption == "summarize") {
    
      data = {
        "article_id": ingestedContentId,
        "format": actionSubOption
      }
    
    } else if (actionOption == "translate") {

      data = {
        "article_id": ingestedContentId,
        "lang": actionSubOption
      }

    } else {

      data = {
        "article_id": ingestedContentId,
        "n_questions": actionSubOption
      }

    }

    const request = await fetch(`${API_URL}/action/${actionOption}`, {
      method: 'POST',
      headers: {
         "content-type": "application/json",
         "Authorization": "Bearer " + localStorage.getItem("access_token")
      },
      body: JSON.stringify(data)
    })

    const response = await request.json()

    if (request.status == 200) {

      if (actionOption != "quiz") {
        setActionResult(response.text)
        setActionError("")
      }

    } else if (request.status == 400 || request.status == 401) {

      setActionError(response.detail)

    } else {

      setActionError("Something went wrong !")
    
    }

    console.log(response)

    setActionLoading(false)

  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="text-2xl font-bold font-sans">WikiSmart</div>
        <div className="flex items-center space-x-4">
          <span className="border-r px-4">{userName}</span>
          <a href="/actions" className="hover:underline">
            Actions
          </a>
          <a href="/profile" className="hover:underline">
            Profile
          </a>
          <button className="bg-white cursor-pointer text-blue-900 font-semibold px-3 py-1 rounded hover:bg-gray-100">
            Sign Out
          </button>
        </div>
      </nav>

      <main className="p-6 space-y-8">
        {/* Ingest Form */}
        <section className="p-6 bg-gray-50 rounded text-gray-600 shadow-md border border-gray-300">
          <h2 className="text-xl text-gray-600 font-bold mb-2">Ingest Article</h2>
          <p className="text-gray-600 mb-10">
            Provide an article URL, topic, or upload a PDF to ingest content.
          </p>

          {
            ingestError && (
              <p className="w-full bg-red-200 text-slate-700 font-semibold px-8 py-5 rounded-md border-red-500 mb-5 -mt-5 text-center">
                {ingestError}
              </p>
            )
          }

          <div className="space-y-4">
            {/* Option buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIngestOption("url")}
                className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                  ingestOption === "url" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                }`}
              >
                URL
              </button>
              <button
                onClick={() => setIngestOption("keyword")}
                className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                  ingestOption === "keyword" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                }`}
              >
                Topic
              </button>
              <button
                onClick={() => setIngestOption("pdf")}
                className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                  ingestOption === "pdf" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                }`}
              >
                PDF
              </button>
              
            </div>

            {/* Input area */}
            <div className="flex-1">
              {ingestOption === "pdf" ? (
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setArticleInput(e.target.files?.[0]?.name || "")
                  }
                  className="border p-2 rounded w-full"
                />
              ) : (
                <input
                  type="text"
                  value={articleInput || ""}
                  onChange={(e) => setArticleInput(e.target.value)}
                  placeholder={ingestOption == "url" ? "ex: https://wikipedia.com/wiki/machine_learning" : "ex: Machine Learning"}
                  className="border p-2 rounded w-full"
                />
              )}
            </div>

            {
              ingestLoading ? (
                <button
                  onClick={handleIngest}
                  className="bg-gray-200 text-slate-700 px-4 py-2 rounded"
                >
                  Ingesting ...
                </button>
              ) : (
                <button
                  onClick={handleIngest}
                  className="bg-blue-900 text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-800"
                >
                  Ingest
                </button>
              )
            }
            
          </div>

          {/* Ingested content */}
          {ingestedContent && (
            <div className="mt-4 p-4 bg-white border max-h-100 overflow-auto rounded shadow">
              <h3 className="font-semibold mb-2">Ingested Content</h3>
              <p>{ingestedContent}</p>
            </div>
          )}
        </section>

        {/* Action Form */}
        { 
          ingestedContent &&
          <section className="bg-gray-50 p-6 rounded text-gray-700 shadow-md border border-gray-300">
            <h2 className="text-xl font-bold mb-4">Select Action</h2>
            <div className="space-y-4">

              {
                actionError && (
                  <p className="w-full bg-red-200 text-slate-700 font-semibold px-8 py-5 rounded-md border-red-500 mb-5 text-center">
                    {actionError}
                  </p>
                )
              }

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h3 className="text-lg font-bold mb-4 text-center">Action Type</h3>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {setActionOption("summarize"); setActionSubOption("court")}}
                      className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                        actionOption === "summarize" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                      }`}
                    >
                      Summerize
                    </button>
                    <button
                      onClick={() => {setActionOption("quiz"); setActionSubOption(5)}}
                      className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                        actionOption === "quiz" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                      }`}
                    >
                      Generate Quiz
                    </button>
                    <button
                      onClick={() => {setActionOption("translate"), setActionSubOption("French")}}
                      className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                        actionOption === "translate" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                      }`}
                    >
                      Translate
                    </button>
                    
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 text-center">
                    {
                      actionOption == "summarize" ? (
                        "Select format"
                      ) : (
                        actionOption == "quiz" ? (
                          "Select number of questions"
                        ) : (
                          "Select language"
                        )
                      )
                    }
                  </h3>

                  {
                    actionOption == "quiz" && (
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setActionSubOption(5)}
                          className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                            actionSubOption === 5 ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                          }`}
                        >
                          5
                        </button>
                        <button
                          onClick={() => setActionSubOption(7)}
                          className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                            actionSubOption === 7 ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                          }`}
                        >
                          7
                        </button>
                        <button
                          onClick={() => setActionSubOption(10)}
                          className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                            actionSubOption === 10 ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                          }`}
                        >
                          10
                        </button>
                        <button
                          onClick={() => setActionSubOption(15)}
                          className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                            actionSubOption === 15 ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                          }`}
                        >
                          15
                        </button>
                      </div>
                    )
                  }

                  {
                    actionOption == "translate" && (
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setActionSubOption("French")}
                          className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                            actionSubOption === "French" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                          }`}
                        >
                          French
                        </button>
                        <button
                          onClick={() => setActionSubOption("English")}
                          className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                            actionSubOption === "English" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                          }`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => setActionSubOption("Arabic")}
                          className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                            actionSubOption === "Arabic" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                          }`}
                        >
                          Arabic
                        </button>
                        <button
                          onClick={() => setActionSubOption("Spanish")}
                          className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                            actionSubOption === "Spanish" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                          }`}
                        >
                          Spanish
                        </button>
                      </div>
                    )
                  }


                  {
                    actionOption == "summarize" && (
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setActionSubOption("court")}
                          className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                            actionSubOption === "court" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                          }`}
                        >
                          Short
                        </button>
                        <button
                          onClick={() => setActionSubOption("moyen")}
                          className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
                            actionSubOption === "moyen" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
                          }`}
                        >
                          Medium
                        </button>
                      </div>
                    )
                  }
                </div>
              </div>

              <div className="text-center mt-10">
                {
                  actionLoading ? (
                    <button
                      onClick={handleIngest}
                      className="bg-gray-200 text-slate-700 px-4 py-2 rounded"
                    >
                      Loading ...
                    </button>
                  ) : (
                    <button
                      onClick={handleAction}
                      className="bg-blue-900 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-800"
                    >
                      Apply
                    </button>
                  )
                }
              </div>
            </div>

            {/* Action result */}
            {actionResult && (
              <div className="mt-4 p-4 bg-white max-h-100 overflow-auto border rounded shadow">
                <h3 className="font-semibold mb-2">Result</h3>
                <p>{actionResult}</p>
              </div>
            )}
          </section>
        }
      </main>
    </div>
  );
};

export default ActionsPage;