from pydantic import BaseModel, Field
from typing import Literal, Optional
from app.schemas.summary_format import SummaryFormat


class IngestWikipediaRequest(BaseModel):
    ressource: str
    method: Literal["url", "keyword"]
    lang: Optional[str] = "fr"


class SummerizeRequest(BaseModel):
    article_id: int
    format: SummaryFormat


class QCMRequest(BaseModel):
    article_id: int
    n_questions: int = Field(
        ...,
        ge=5,
        le=15,
        description="Nombre de questions (entre 5 et 15)"
    )


class TranslateRequest(BaseModel):
    article_id: int
    lang: Literal["French", "English", "Spanish", "Arabic"]