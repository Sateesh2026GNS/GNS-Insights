from fastapi import APIRouter, Depends, HTTPException, Request, status
<<<<<<< HEAD
from fastapi.responses import JSONResponse
from sqlalchemy import select, func
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
from sqlalchemy.orm import Session

from app.api.auth_deps import get_current_user
from app.api.deps import get_db
from app.core.config import get_settings
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    ForgotPasswordRequest,
<<<<<<< HEAD
    ForgotPasswordSuccessResponse,
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    LoginRequest,
    MessageResponse,
    RefreshRequest,
    RegisterPendingResponse,
    RegisterRequest,
    ResetPasswordRequest,
<<<<<<< HEAD
    ResetPasswordSuccessResponse,
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    UserResponse,
    VerifyEmailRequest,
)
from app.services import rbac_service
from app.services.audit_service import log_audit
<<<<<<< HEAD
from app.services.audit_log_service import AuditLogService
from app.services.auth_service import (
    ROLE_MISMATCH_MESSAGE,
    assert_user_has_role,
    build_access_token_for_user,
    find_user_by_email,
    get_user_with_role,
    issue_auth_response_data,
    login_user,
    register_user,
)
from app.services.email_service import send_verification_email
from app.services.login_history_service import mark_logout, record_login_history
from app.services.password_reset_service import PasswordResetService
from app.services.security_service import (
    INVALID_CREDENTIALS,
    create_email_verification,
=======
from app.services.auth_service import (
    authenticate_user,
    create_access_token,
    find_user_by_email,
    get_user_with_role,
    hash_password,
    issue_auth_response_data,
    register_user,
)
from app.services.email_service import send_password_reset_email, send_verification_email
from app.services.security_service import (
    INVALID_CREDENTIALS,
    consume_password_reset,
    create_email_verification,
    create_password_reset,
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    is_account_locked,
    record_login_attempt,
    register_failed_login,
    rotate_refresh_token,
    revoke_refresh_token,
    touch_user_activity,
    validate_refresh_token,
    verify_email,
)

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

<<<<<<< HEAD
=======
PASSWORD_RESET_SENT = "If an account exists for this email, a reset link has been sent."

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

def _client_ip(request: Request) -> str | None:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None


@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    email = req.email
    ip_address = _client_ip(request)
    user_agent = request.headers.get("User-Agent")
    user = find_user_by_email(db, email)

    if user and is_account_locked(user):
        record_login_attempt(
            db,
            email=email,
            success=False,
            user_id=user.id,
            ip_address=ip_address,
            user_agent=user_agent,
            failure_reason="locked",
        )
<<<<<<< HEAD
        record_login_history(
            db,
            email=email,
            success=False,
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        AuditLogService.log_login_failed(
            db, request=request, email=email, user=user
        )
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Account temporarily locked. Try again later.",
        )

<<<<<<< HEAD
    if not db.scalar(select(func.count(User.id))):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user accounts found. Please contact your administrator.",
        )

    try:
        authenticated = login_user(db, email, req.password)
    except HTTPException as exc:
        if exc.status_code == status.HTTP_401_UNAUTHORIZED:
            if user:
                register_failed_login(db, user, email)
            record_login_attempt(
                db,
                email=email,
                success=False,
                user_id=user.id if user else None,
                ip_address=ip_address,
                user_agent=user_agent,
                failure_reason="invalid",
            )
            record_login_history(
                db,
                email=email,
                success=False,
                user=user,
                ip_address=ip_address,
                user_agent=user_agent,
            )
            AuditLogService.log_login_failed(
                db, request=request, email=email, user=user
            )
            detail = exc.detail if isinstance(exc.detail, str) else "Invalid email or password."
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=detail,
            ) from exc
        raise

    db.refresh(authenticated, ["roles", "tenant"])
    try:
        actual_role = assert_user_has_role(authenticated, req.role)
    except HTTPException as exc:
        if user:
            register_failed_login(db, authenticated, email)
=======
    authenticated = authenticate_user(db, email, req.password)
    if not authenticated or not authenticated.is_active or not authenticated.email_verified:
        if user:
            register_failed_login(db, user, email)
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        record_login_attempt(
            db,
            email=email,
            success=False,
<<<<<<< HEAD
            user_id=authenticated.id,
            ip_address=ip_address,
            user_agent=user_agent,
            failure_reason="role_mismatch",
        )
        record_login_history(
            db,
            email=email,
            success=False,
            user=authenticated,
            ip_address=ip_address,
            user_agent=user_agent,
            role=req.role,
        )
        AuditLogService.log_login_failed(
            db,
            request=request,
            email=email,
            user=authenticated,
            details=ROLE_MISMATCH_MESSAGE,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ROLE_MISMATCH_MESSAGE,
        ) from exc
=======
            user_id=user.id if user else None,
            ip_address=ip_address,
            user_agent=user_agent,
            failure_reason="invalid",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_CREDENTIALS,
        )
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

    record_login_attempt(
        db,
        email=email,
        success=True,
        user_id=authenticated.id,
        ip_address=ip_address,
        user_agent=user_agent,
    )
<<<<<<< HEAD
    record_login_history(
        db,
        email=email,
        success=True,
        user=authenticated,
        ip_address=ip_address,
        user_agent=user_agent,
        role=actual_role,
    )
    AuditLogService.log_login_success(
        db,
        request=request,
        user=authenticated,
        role=actual_role,
    )
    data = issue_auth_response_data(
        db,
        authenticated,
        ip_address=ip_address,
        user_agent=user_agent,
        role_name=actual_role,
=======
    rbac_service.log_activity(
        db,
        tenant_id=authenticated.tenant_id,
        user_id=authenticated.id,
        action="login",
        resource="auth",
        request=request,
    )
    data = issue_auth_response_data(
        db, authenticated, ip_address=ip_address, user_agent=user_agent
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    )
    return AuthResponse(**data)


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserResponse:
    user_data = get_user_with_role(db, current_user)
    user_data["email_verified"] = current_user.email_verified
    return UserResponse(**user_data)


<<<<<<< HEAD
@router.get("/profile", response_model=UserResponse)
def get_auth_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserResponse:
    """Alias for /auth/me — JWT profile with company and role claims."""
    return get_me(current_user=current_user, db=db)


@router.post("/register", response_model=RegisterPendingResponse, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    """Public registration is disabled — companies are provisioned by GNS Super Admin."""
    if not settings.allow_public_registration:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Public company registration is disabled. Contact your GNS administrator.",
        )
    from app.core.company_email import MSG_REGISTRATION_SUCCESS

    try:
        user = register_user(
            db,
            company_name=req.company_name,
            full_name=req.full_name,
            email=req.email,
            password=req.password,
            role_name=req.role,
        )
    except HTTPException as exc:
        if exc.status_code == status.HTTP_409_CONFLICT:
            message = exc.detail if isinstance(exc.detail, str) else "Registration failed."
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content={"success": False, "message": message},
            )
        raise
=======
@router.post("/register", response_model=AuthResponse | RegisterPendingResponse)
def register(req: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    user = register_user(
        db,
        company_name=req.company_name,
        full_name=req.full_name,
        email=req.email,
        password=req.password,
        role=req.role,
    )
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        action="create",
        resource="user_registration",
        resource_id=user.id,
        ip_address=_client_ip(request),
    )

    if settings.email_verification_required:
        raw_token = create_email_verification(db, user)
        send_verification_email(user.email, raw_token)
        return RegisterPendingResponse(
            message="Registration successful. Please verify your email before signing in.",
            email_verification_required=True,
        )

<<<<<<< HEAD
    return RegisterPendingResponse(
        message=MSG_REGISTRATION_SUCCESS,
        email_verification_required=False,
    )
=======
    data = issue_auth_response_data(db, user)
    return AuthResponse(**data)
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8


@router.post("/verify-email", response_model=MessageResponse)
def verify_email_endpoint(req: VerifyEmailRequest, request: Request, db: Session = Depends(get_db)):
    user = verify_email(db, req.token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification link.",
        )
    log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        action="update",
        resource="email_verification",
        resource_id=user.id,
        ip_address=_client_ip(request),
    )
    return MessageResponse(message="Email verified successfully. You may now sign in.")


@router.post("/resend-verification", response_model=MessageResponse)
def resend_verification(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = find_user_by_email(db, req.email)
    if user and not user.email_verified:
        raw_token = create_email_verification(db, user)
        send_verification_email(user.email, raw_token)
    return MessageResponse(
        message="If an unverified account exists for this email, a verification link has been sent."
    )


<<<<<<< HEAD
@router.post("/forgot-password", response_model=ForgotPasswordSuccessResponse)
async def forgot_password(
    req: ForgotPasswordRequest, request: Request, db: Session = Depends(get_db)
):
    message = await PasswordResetService(db).request_reset(req.email, request)
    return ForgotPasswordSuccessResponse(success=True, message=message)


@router.get("/validate-reset-token")
def validate_reset_token(token: str, db: Session = Depends(get_db)):
    data = PasswordResetService(db).validate_reset_token(token)
    return {"success": True, "message": data["message"], "data": data}


@router.post("/reset-password", response_model=ResetPasswordSuccessResponse)
def reset_password(req: ResetPasswordRequest, request: Request, db: Session = Depends(get_db)):
    message = PasswordResetService(db).reset_password(req.token, req.password, request)
    return ResetPasswordSuccessResponse(success=True, message=message)
=======
@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(req: ForgotPasswordRequest, request: Request, db: Session = Depends(get_db)):
    user = find_user_by_email(db, req.email)
    if user and user.is_active:
        raw_token = create_password_reset(db, user)
        send_password_reset_email(user.email, raw_token)
        log_audit(
            db,
            tenant_id=user.tenant_id,
            user_id=user.id,
            action="create",
            resource="password_reset_request",
            resource_id=user.id,
            ip_address=_client_ip(request),
        )
    return MessageResponse(message=PASSWORD_RESET_SENT)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(req: ResetPasswordRequest, request: Request, db: Session = Depends(get_db)):
    user = consume_password_reset(db, req.token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link.",
        )
    user.hashed_password = hash_password(req.password)
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        action="update",
        resource="password_reset",
        resource_id=user.id,
        ip_address=_client_ip(request),
    )
    rbac_service.log_activity(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        action="password_reset",
        resource="auth",
        request=request,
    )
    return MessageResponse(message="Password reset successfully. You may now sign in.")
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8


@router.post("/refresh", response_model=AuthResponse)
def refresh_tokens(req: RefreshRequest, request: Request, db: Session = Depends(get_db)):
    ip_address = _client_ip(request)
    user_agent = request.headers.get("User-Agent")
    user = validate_refresh_token(db, req.refresh_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_CREDENTIALS,
        )
<<<<<<< HEAD
    db.refresh(user, ["roles"])
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    touch_user_activity(db, user)
    new_refresh = rotate_refresh_token(
        db, req.refresh_token, user, ip_address=ip_address, user_agent=user_agent
    )
<<<<<<< HEAD
    access = build_access_token_for_user(user)
=======
    access = create_access_token({"sub": str(user.id), "email": user.email})
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    user_data = get_user_with_role(db, user)
    user_data["email_verified"] = user.email_verified
    return AuthResponse(
        access_token=access,
        refresh_token=new_refresh,
        user=UserResponse(**user_data),
    )


@router.post("/logout", response_model=MessageResponse)
def logout(
    req: RefreshRequest,
    request: Request,
    db: Session = Depends(get_db),
):
<<<<<<< HEAD
    user = validate_refresh_token(db, req.refresh_token)
    revoke_refresh_token(db, req.refresh_token)
    if user:
        mark_logout(db, user_id=user.id, email=user.email)
        AuditLogService.log_logout(db, request=request, user=user)
=======
    revoke_refresh_token(db, req.refresh_token)
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    return MessageResponse(message="Logged out successfully.")
