import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../ui/Navbar";
import Quiz from "../quiz/Quiz";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";


const ArticleIngestion = () => {

  const [sourceTab, setSourceTab] = useState('URL');
  const [ingestedData, setIngestedData] = useState<string>("");
  const [showContent, setShowContent] = useState(false);
  
  const [activeAction, setActiveAction] = useState('Summarize');
  const [subOption, setSubOption] = useState('Court');
  const [result, setResult] = useState<any>(null);
  const [quizRange, setQuizRange] = useState(5);


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


  const navigate = useNavigate();

  // State for article ingestion
  const [articleInput, setArticleInput] = useState<string | null>("");
  const [ingestedDataId, setIngestedDataId] = useState<number | null>(null);
  const [ingestLoading, setIngestLoading] = useState<boolean>(false);
  const [ingestError, setIngestError] = useState<string>("");

  // State for actions
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string>("");
  const [quizId, setQuizId] = useState<number>(0)
  

  // Handlers
  const handleIngest = async (e: any) => {
    e.preventDefault();

    if (sourceTab == "PDF") {
      alert("This option is not available yet")
      return
    }

    setIngestLoading(true)

    const request = await fetch(`${API_URL}/ingest/wikipedia`, {
      method: 'POST',
      headers: {
         "content-type": "application/json",
         "Authorization": "Bearer " + localStorage.getItem("access_token")
      },
      body: JSON.stringify({
        method: sourceTab.toLowerCase(),
        ressource: articleInput
      })
    })

    const response = await request.json()

    if (request.status == 200) {

      setIngestedData(response.content)
      setIngestedDataId(response.id)
      setIngestError("")

    } else if (request.status == 401) {

      navigate('/login')

    } else {

      setIngestError(response.detail)
    
    }

    setIngestLoading(false)
  };



  // Handle Action

  const handleAction = async (e: any) => {
    
    e.preventDefault();

    setActionLoading(true)

    let data = {}

    if (activeAction == "Summarize") {
    
      data = {
        "article_id": ingestedDataId,
        "format": subOption.toLowerCase()
      }
    
    } else if (activeAction == "Translate") {

      data = {
        "article_id": ingestedDataId,
        "lang": subOption
      }

    } else {

      data = {
        "article_id": ingestedDataId,
        "n_questions": quizRange
      }

    }

    const request = await fetch(`${API_URL}/action/${activeAction != "Generate Quiz" ? activeAction.toLowerCase() : "quiz"}`, {
      method: 'POST',
      headers: {
         "content-type": "application/json",
         "Authorization": "Bearer " + localStorage.getItem("access_token")
      },
      body: JSON.stringify(data)
    })

    const response = await request.json()

    if (request.status == 200) {

      setActionError("")

      if (activeAction != "Generate Quiz") {
        setResult({
          type: "text",
          content: response.text
        })
      } else {
        setQuizId(response.quiz_id)
        setResult({
          type: 'quiz',
          questions: response.quiz
        })
      }

    } else if (request.status == 400 || request.status == 401 || request.status == 404) {

      setActionError(response.detail)

    } else {

      setActionError("Something went wrong !")
    
    }

    setActionLoading(false)

  };


  return (
    <>
      <div className="max-w-4xl mx-auto py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">Content Studio</h1>
          <p className="text-slate-500">Transform Wikipedia articles or PDFs into insights.</p>
        </header>

        {/* --- INGESTION FORM --- */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="flex bg-slate-50 border-b border-slate-200">
            {['URL', 'Keyword', 'PDF'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSourceTab(tab)}
                className={`px-8 cursor-pointer py-4 text-sm font-bold transition-colors ${sourceTab === tab ? 'bg-white text-blue-600 border-t-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            <form onSubmit={handleIngest} className="space-y-4">

              {
                ingestError && (
                  <p className="text-center py-2 text-red-500">{ingestError}</p>
                )
              }

              {sourceTab !== 'PDF' ? (
                <input 
                  type="text" 
                  placeholder={sourceTab === 'URL' ? "Paste Wikipedia URL here..." : "Search a topic..."}
                  onChange={(e: any) => {setArticleInput(e.target.value)}}
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
              <button type="submit" className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-transform active:scale-[0.98]">
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
              <div className="p-6 bg-white border max-h-150 overflow-auto border-slate-200 rounded-xl text-slate-600 leading-relaxed shadow-inner">
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
                    setSubOption(action === 'Summarize' ? 'Court' : action === 'Translate' ? 'French' : '5');
                  }}
                  className={`flex-1 cursor-pointer py-2 text-sm font-bold rounded-md transition-all ${activeAction === action ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Sub-Options */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {activeAction === 'Summarize' && ['Court', 'Moyen'].map(o => (
                  <button key={o} onClick={() => setSubOption(o)} className={`px-4 cursor-pointer py-1.5 rounded-full text-xs font-bold border ${subOption === o ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-500'}`}>{o}</button>
                ))}
                {activeAction === 'Translate' && ['French', 'Arabic', 'English', 'Spanish'].map(o => (
                  <button key={o} onClick={() => setSubOption(o)} className={`px-4 cursor-pointer py-1.5 rounded-full text-xs font-bold border ${subOption === o ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-500'}`}>{o}</button>
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

              {
                actionLoading ? (
                  <button className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-bold">
                    Processing
                  </button>
                ) : (
                  <button onClick={handleAction} className="w-full cursor-pointer bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-black transition-colors">
                    Process Content
                  </button>
                )
              }
            
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
                    <p className="font-bold mb-3">{i + 1}. {q.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt: any, idx: number) => (
                        <button key={idx} className="text-left p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-500 transition-colors">
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ArticleIngestion;