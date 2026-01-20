from pydantic import BaseModel, Field
from app.schemas.summary_format import SummaryFormat


class SummerizeRequest(BaseModel):
    subject: str
    format: SummaryFormat
    sections: dict


class QCMRequest(BaseModel):
    sections: dict[str, str]
    n_questions: int = Field(
        ...,
        ge=1,
        le=10,
        description="Nombre de questions (entre 1 et 10)"
    )