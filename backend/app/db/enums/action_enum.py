from enum import Enum

class EnumAction(str, Enum):
    TRANSLATE = "TRANSLATE"
    SUMMERIZE = "SUMMERIZE"
    QCM = "QCM"
