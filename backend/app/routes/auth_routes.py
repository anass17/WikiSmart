from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.controllers.auth_controller import AuthController
from app.db.deps import get_db
from sqlalchemy.orm import Session
from app.schemas.auth_schema import TokenResponse, RegisterRequest


router = APIRouter(prefix='/auth', tags=['Auth'])



# Register Endpoint

@router.post("/register", response_model=TokenResponse, status_code=201)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    controller = AuthController(db)
    token = controller.register_user(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password=data.password
    )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        )

    return {"access_token": token}



# Login Endpoint

@router.post('/login', response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    controller = AuthController(db)
    token = controller.authenticate_user(
        email=form_data.username,
        password=form_data.password
    )

    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"access_token": token}