from fastapi import APIRouter, Depends
from app.controllers.statistics_controller import StatisticsController
from app.db.deps import get_db
from app.core.deps import require_roles


router = APIRouter(prefix="/statistics", tags=["Statistics"])




@router.get("")
def get_statistics(
    db = Depends(get_db),
    user_id = Depends(require_roles("USER", "ADMIN")),
):
    controller = StatisticsController(db)
    result = controller.get_statistics(user_id)

    return result

