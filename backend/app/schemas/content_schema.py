from pydantic import BaseModel
from app.schemas.summary_format import SummaryFormat


class SummerizeRequest(BaseModel):
    subject: str
    format: SummaryFormat
    sections: dict
