from pydantic import BaseModel, Field
from typing import Literal, Optional
from app.schemas.summary_format import SummaryFormat


class IngestWikipediaRequest(BaseModel):
    ressource: str
    method: Literal["url", "keyword"]
    lang: Optional[str] = "fr"


class SummerizeRequest(BaseModel):
    text: str
    format: SummaryFormat


class QCMRequest(BaseModel):
    text: str
    n_questions: int = Field(
        ...,
        ge=1,
        le=10,
        description="Nombre de questions (entre 1 et 10)"
    )


class TranslateRequest(BaseModel):
    text: str
    lang: Literal["French", "English", "Espanol", "Arabic"]