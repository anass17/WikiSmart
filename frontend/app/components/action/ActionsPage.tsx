import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../ui/Navbar";
import Quiz from "../quiz/Quiz";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

// const ActionsPage: React.FC = () => {

//   const navigate = useNavigate();

//   // State for article ingestion
//   const [ingestOption, setIngestOption] = useState<"url" | "keyword" | "pdf">("url");
//   const [articleInput, setArticleInput] = useState<string | null>("");
//   const [ingestedContent, setIngestedContent] = useState<string>("");
//   const [ingestedContentId, setIngestedContentId] = useState<number | null>(null);
//   const [ingestLoading, setIngestLoading] = useState<boolean>(false);
//   const [ingestError, setIngestError] = useState<string>("");

//   // State for actions
//   const [actionOption, setActionOption] = useState<"summarize" | "quiz" | "translate">("summarize");
//   const [actionSubOption, setActionSubOption] = useState<string | number>("court");
//   const [actionResult, setActionResult] = useState<string>("");
//   const [actionLoading, setActionLoading] = useState<boolean>(false);
//   const [actionError, setActionError] = useState<string>("");
//   const [actionQCM, setActionQCM] = useState<any>(null)
//   const [quizId, setQuizId] = useState<number>(0)
  

//   // Handlers
//   const handleIngest = async (e: any) => {
//     e.preventDefault();

//     if (ingestOption == "pdf") {
//       alert("This option is not available yet")
//       return
//     }

//     setIngestLoading(true)

//     const request = await fetch(`${API_URL}/ingest/wikipedia`, {
//       method: 'POST',
//       headers: {
//          "content-type": "application/json"
//       },
//       body: JSON.stringify({
//         method: ingestOption,
//         ressource: articleInput
//       })
//     })

//     const response = await request.json()

//     if (request.status == 200) {

//       setIngestedContent(response.content)
//       setIngestedContentId(response.id)
//       setIngestError("")

//     } else if (request.status == 400) {

//       setIngestError(response.detail)

//     } else {

//       setIngestError("Something went wrong !")
    
//     }

//     setIngestLoading(false)
//   };



//   // Handle Action

//   const handleAction = async (e: any) => {
    
//     e.preventDefault();

//     setActionLoading(true)

//     let data = {}

//     if (actionOption == "summarize") {
    
//       data = {
//         "article_id": ingestedContentId,
//         "format": actionSubOption
//       }
    
//     } else if (actionOption == "translate") {

//       data = {
//         "article_id": ingestedContentId,
//         "lang": actionSubOption
//       }

//     } else {

//       data = {
//         "article_id": ingestedContentId,
//         "n_questions": actionSubOption
//       }

//     }

//     const request = await fetch(`${API_URL}/action/${actionOption}`, {
//       method: 'POST',
//       headers: {
//          "content-type": "application/json",
//          "Authorization": "Bearer " + localStorage.getItem("access_token")
//       },
//       body: JSON.stringify(data)
//     })

//     const response = await request.json()

//     if (request.status == 200) {

//       setActionError("")

//       if (actionOption != "quiz") {
//         setActionResult(response.text)
//       } else {
//         setQuizId(response.quiz_id)
//         setActionQCM(response.quiz)
//       }

//     } else if (request.status == 400 || request.status == 401 || request.status == 404) {

//       setActionError(response.detail)

//     } else {

//       setActionError("Something went wrong !")
    
//     }

//     setActionLoading(false)

//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navbar */}
//       <Navbar />

//       <main className="p-6 space-y-8">
//         {/* Ingest Form */}
//         <section className="p-6 bg-gray-50 rounded text-gray-600 shadow-md border border-gray-300">
//           <h2 className="text-xl text-gray-600 font-bold mb-2">Ingest Article</h2>
//           <p className="text-gray-600 mb-10">
//             Provide an article URL, topic, or upload a PDF to ingest content.
//           </p>

//           {
//             ingestError && (
//               <p className="w-full bg-red-200 text-slate-700 font-semibold px-8 py-5 rounded-md border-red-500 mb-5 -mt-5 text-center">
//                 {ingestError}
//               </p>
//             )
//           }

//           <div className="space-y-4">
//             {/* Option buttons */}
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={() => setIngestOption("url")}
//                 className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                   ingestOption === "url" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                 }`}
//               >
//                 URL
//               </button>
//               <button
//                 onClick={() => setIngestOption("keyword")}
//                 className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                   ingestOption === "keyword" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                 }`}
//               >
//                 Topic
//               </button>
//               <button
//                 onClick={() => setIngestOption("pdf")}
//                 className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                   ingestOption === "pdf" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                 }`}
//               >
//                 PDF
//               </button>
              
//             </div>

//             {/* Input area */}
//             <div className="flex-1">
//               {ingestOption === "pdf" ? (
//                 <input
//                   type="file"
//                   accept=".pdf"
//                   onChange={(e) =>
//                     setArticleInput(e.target.files?.[0]?.name || "")
//                   }
//                   className="border p-2 rounded w-full"
//                 />
//               ) : (
//                 <input
//                   type="text"
//                   value={articleInput || ""}
//                   onChange={(e) => setArticleInput(e.target.value)}
//                   placeholder={ingestOption == "url" ? "ex: https://wikipedia.com/wiki/machine_learning" : "ex: Machine Learning"}
//                   className="border p-2 rounded w-full"
//                 />
//               )}
//             </div>

//             {
//               ingestLoading ? (
//                 <button
//                   onClick={handleIngest}
//                   className="bg-gray-200 text-slate-700 px-4 py-2 rounded"
//                 >
//                   Ingesting ...
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleIngest}
//                   className="bg-blue-900 text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-800"
//                 >
//                   Ingest
//                 </button>
//               )
//             }
            
//           </div>

//           {/* Ingested content */}
//           {ingestedContent && (
//             <div className="mt-4 p-4 bg-white border max-h-100 overflow-auto rounded shadow">
//               <h3 className="font-semibold mb-2">Ingested Content</h3>
//               <p>{ingestedContent}</p>
//             </div>
//           )}
//         </section>

//         {/* Action Form */}
//         { 
//           ingestedContent &&
//           <section className="bg-gray-50 p-6 rounded text-gray-700 shadow-md border border-gray-300">
//             <h2 className="text-xl font-bold mb-4">Select Action</h2>
//             <div className="space-y-4">

//               {
//                 actionError && (
//                   <p className="w-full bg-red-200 text-slate-700 font-semibold px-8 py-5 rounded-md border-red-500 mb-5 text-center">
//                     {actionError}
//                   </p>
//                 )
//               }

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <h3 className="text-lg font-bold mb-4 text-center">Action Type</h3>
//                   <div className="flex justify-center space-x-4">
//                     <button
//                       onClick={() => {setActionOption("summarize"); setActionSubOption("court")}}
//                       className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                         actionOption === "summarize" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                       }`}
//                     >
//                       Summerize
//                     </button>
//                     <button
//                       onClick={() => {setActionOption("quiz"); setActionSubOption(5)}}
//                       className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                         actionOption === "quiz" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                       }`}
//                     >
//                       Generate Quiz
//                     </button>
//                     <button
//                       onClick={() => {setActionOption("translate"), setActionSubOption("French")}}
//                       className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                         actionOption === "translate" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                       }`}
//                     >
//                       Translate
//                     </button>
                    
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-bold mb-4 text-center">
//                     {
//                       actionOption == "summarize" ? (
//                         "Select format"
//                       ) : (
//                         actionOption == "quiz" ? (
//                           "Select number of questions"
//                         ) : (
//                           "Select language"
//                         )
//                       )
//                     }
//                   </h3>

//                   {
//                     actionOption == "quiz" && (
//                       <div className="flex justify-center space-x-4">
//                         <button
//                           onClick={() => setActionSubOption(5)}
//                           className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                             actionSubOption === 5 ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                           }`}
//                         >
//                           5
//                         </button>
//                         <button
//                           onClick={() => setActionSubOption(7)}
//                           className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                             actionSubOption === 7 ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                           }`}
//                         >
//                           7
//                         </button>
//                         <button
//                           onClick={() => setActionSubOption(10)}
//                           className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                             actionSubOption === 10 ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                           }`}
//                         >
//                           10
//                         </button>
//                         <button
//                           onClick={() => setActionSubOption(15)}
//                           className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                             actionSubOption === 15 ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                           }`}
//                         >
//                           15
//                         </button>
//                       </div>
//                     )
//                   }

//                   {
//                     actionOption == "translate" && (
//                       <div className="flex justify-center space-x-4">
//                         <button
//                           onClick={() => setActionSubOption("French")}
//                           className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                             actionSubOption === "French" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                           }`}
//                         >
//                           French
//                         </button>
//                         <button
//                           onClick={() => setActionSubOption("English")}
//                           className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                             actionSubOption === "English" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                           }`}
//                         >
//                           English
//                         </button>
//                         <button
//                           onClick={() => setActionSubOption("Arabic")}
//                           className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                             actionSubOption === "Arabic" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                           }`}
//                         >
//                           Arabic
//                         </button>
//                         <button
//                           onClick={() => setActionSubOption("Spanish")}
//                           className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                             actionSubOption === "Spanish" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                           }`}
//                         >
//                           Spanish
//                         </button>
//                       </div>
//                     )
//                   }


//                   {
//                     actionOption == "summarize" && (
//                       <div className="flex justify-center space-x-4">
//                         <button
//                           onClick={() => setActionSubOption("court")}
//                           className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                             actionSubOption === "court" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                           }`}
//                         >
//                           Short
//                         </button>
//                         <button
//                           onClick={() => setActionSubOption("moyen")}
//                           className={`px-5 py-2 rounded cursor-pointer hover:shadow-sm transition ${
//                             actionSubOption === "moyen" ? "bg-blue-900 text-white" : "bg-white border border-gray-300"
//                           }`}
//                         >
//                           Medium
//                         </button>
//                       </div>
//                     )
//                   }
//                 </div>
//               </div>

//               <div className="text-center mt-10">
//                 {
//                   actionLoading ? (
//                     <button
//                       onClick={handleIngest}
//                       className="bg-gray-200 text-slate-700 px-4 py-2 rounded"
//                     >
//                       Loading ...
//                     </button>
//                   ) : (
//                     <button
//                       onClick={handleAction}
//                       className="bg-blue-900 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-800"
//                     >
//                       Apply
//                     </button>
//                   )
//                 }
//               </div>
//             </div>

//             {/* Action result */}
//             {actionResult && actionOption != "quiz" && (
//               <div className="mt-4 p-4 bg-white max-h-100 overflow-auto border rounded shadow">
//                 <h3 className="font-semibold mb-2">Result</h3>
//                 <p>{actionResult}</p>
//               </div>
//             )}

//             {actionQCM && (
//              <Quiz quizId={quizId} actionQCM={actionQCM} />
//             )}
//           </section>
//         }
//       </main>
//     </div>
//   );
// };

const ArticleIngestion = () => {
  // Main State
  const [sourceTab, setSourceTab] = useState('URL');
  const [ingestedData, setIngestedData] = useState<string>("");
  const [showContent, setShowContent] = useState(false);
  
  // Action State
  const [activeAction, setActiveAction] = useState('Summarize');
  const [subOption, setSubOption] = useState('Short');
  const [result, setResult] = useState<any>(null);
  const [quizRange, setQuizRange] = useState(5);

  const handleIngest = (e: any) => {
    e.preventDefault();
    setIngestedData("This is the natively ingested content. No external icon libraries were harmed in the making of this component.");
  };

  const handleApplyAction = () => {
    if (activeAction === 'Generate Quiz') {
      setResult({
        type: 'quiz',
        questions: Array(+quizRange).fill(0).map((_, i) => ({
          q: `Native Question ${i + 1}: How many dependencies does this component have?`,
          options: ['Zero', 'One', 'Too many', 'None']
        }))
      });
    } else {
      setResult({
        type: 'text',
        content: `Native ${activeAction} Result (${subOption}): Processing complete using built-in React state management.`
      });
    }
  };

  // Standard SVG Icons as constants
  const Icons = {
    Url: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
    File: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">Content Studio</h1>
          <p className="text-slate-500">Transform Wikipedia articles or PDFs into insights.</p>
        </header>

        {/* --- INGESTION FORM --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="flex bg-slate-50 border-b border-slate-200">
            {['URL', 'Topic', 'PDF'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSourceTab(tab)}
                className={`px-8 py-4 text-sm font-bold transition-colors ${sourceTab === tab ? 'bg-white text-blue-600 border-t-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            <form onSubmit={handleIngest} className="space-y-4">
              {sourceTab !== 'PDF' ? (
                <input 
                  type="text" 
                  placeholder={sourceTab === 'URL' ? "Paste Wikipedia URL here..." : "Search a topic..."}
                  className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg p-10 text-center">
                  <input type="file" id="native-file" className="hidden" />
                  <label htmlFor="native-file" className="cursor-pointer text-blue-600 font-semibold">
                    Click to select a PDF file
                  </label>
                </div>
              )}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-transform active:scale-[0.98]">
                Ingest Source
              </button>
            </form>
          </div>
        </div>

        {/* --- CONTENT PREVIEW --- */}
        {ingestedData && (
          <div className="mb-6">
            <button 
              onClick={() => setShowContent(!showContent)}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-4"
            >
              <Icons.Check /> {showContent ? 'Hide Extracted Text' : 'View Extracted Text'}
            </button>
            
            {showContent && (
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-slate-600 leading-relaxed shadow-inner">
                {ingestedData}
              </div>
            )}
          </div>
        )}

        {/* --- ACTIONS SECTION --- */}
        {ingestedData && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold mb-4 text-slate-700">Apply AI Action</h3>
            
            {/* Action Selection */}
            <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
              {['Summarize', 'Translate', 'Generate Quiz'].map(action => (
                <button
                  key={action}
                  onClick={() => {
                    setActiveAction(action);
                    setSubOption(action === 'Summarize' ? 'Short' : action === 'Translate' ? 'French' : '5');
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeAction === action ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Sub-Options */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {activeAction === 'Summarize' && ['Short', 'Medium'].map(o => (
                  <button key={o} onClick={() => setSubOption(o)} className={`px-4 py-1.5 rounded-full text-xs font-bold border ${subOption === o ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-500'}`}>{o}</button>
                ))}
                {activeAction === 'Translate' && ['French', 'Arabic', 'English', 'Spanish'].map(o => (
                  <button key={o} onClick={() => setSubOption(o)} className={`px-4 py-1.5 rounded-full text-xs font-bold border ${subOption === o ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-500'}`}>{o}</button>
                ))}
                {activeAction === 'Generate Quiz' && (
                  <div className="w-full">
                    <input type="range" min="5" max="15" value={quizRange} onChange={(e) => setQuizRange(+e.target.value)} className="w-full accent-blue-600" />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1 uppercase">
                      <span>Min: 5</span>
                      <span className="text-blue-600 font-black">Target: {quizRange}</span>
                      <span>Max: 15</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button onClick={handleApplyAction} className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-black transition-colors">
              Process Content
            </button>
          </div>
        )}

        {/* --- RESULTS DISPLAY --- */}
        {result && (
          <div className="mt-8 p-8 bg-white rounded-xl border-2 border-blue-100 shadow-lg mb-10">
            {result.type === 'text' ? (
              <p className="text-slate-700 leading-relaxed font-medium">{result.content}</p>
            ) : (
              <div className="space-y-6">
                {result.questions.map((q: any, i: number) => (
                  <div key={i} className="border-b border-slate-100 pb-4">
                    <p className="font-bold mb-3">{q.q}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt: any, idx: number) => (
                        <button key={idx} className="text-left p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-500 transition-colors">
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Submit Answers</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ArticleIngestion;