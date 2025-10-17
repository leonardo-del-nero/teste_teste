from fastapi import APIRouter
from app.services import dashboard_service
from app.models.dashboard.dashboard_state import DashboardState
from app.services import dashboard_service

app = APIRouter()

@app.get("/dashboard", response_model=DashboardState)
async def get_dashboard():
    return dashboard_service.load_dashboard_data()

@app.get("/history")
async def get_history():
    return dashboard_service.get_history_data()

@app.post("/reset", response_model=DashboardState)
async def reset_dashboard():
    return dashboard_service.reset_dashboard()

