import re
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from jose import JWTError, jwt
<<<<<<< HEAD
import bcrypt
from sqlalchemy import func, select
=======
from passlib.context import CryptContext
from sqlalchemy import select
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.core.config import get_settings
<<<<<<< HEAD
from app.core.rbac_constants import REGISTERABLE_ROLES
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
from app.core.seed_roles import seed_roles_for_tenant
from app.models.role import Role
from app.models.tenant import Tenant
from app.models.user import User, user_roles

<<<<<<< HEAD
=======
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
_settings = get_settings()
SECRET_KEY = _settings.jwt_secret_key
ALGORITHM = _settings.jwt_algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = _settings.access_token_expire_minutes


def _slugify(name: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", name.strip().lower()).strip("-")
    return s[:80] if s else "tenant"


def verify_password(plain: str, hashed: str) -> bool:
<<<<<<< HEAD
    try:
        return bcrypt.checkpw(
            plain.encode("utf-8"),
            hashed.encode("utf-8") if isinstance(hashed, str) else hashed,
        )
    except (ValueError, TypeError):
        return False


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
=======
    return pwd_context.verify(plain, hashed)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


<<<<<<< HEAD
ROLE_MISMATCH_MESSAGE = (
    "The selected role does not match your account. Please choose the correct role."
)


def build_access_token_for_user(user: User, *, role_name: str | None = None) -> str:
    """JWT claims: user_id, company_id, email, full_name, role (+ legacy aliases)."""
    roles = list(getattr(user, "roles", None) or [])
    role = None
    if role_name:
        role = next((r for r in roles if r.name == role_name), None)
    if role is None:
        role = roles[0] if roles else None
    resolved_role = role.name if role else (role_name or "Operator")
    company_name = None
    tenant = getattr(user, "tenant", None)
    if tenant is not None:
        company_name = tenant.name
    return create_access_token(
        {
            "sub": str(user.id),
            "user_id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "company_id": user.tenant_id,
            "tenant_id": user.tenant_id,
            "company_name": company_name,
            "role": resolved_role,
            "role_id": role.id if role else None,
            "role_name": resolved_role,
        }
    )


def assert_user_has_role(user: User, selected_role: str) -> str:
    """Ensure the selected login role matches a role assigned to the user."""
    selected = (selected_role or "").strip()
    user_roles = {r.name for r in (getattr(user, "roles", None) or [])}
    if selected not in user_roles:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ROLE_MISMATCH_MESSAGE,
        )
    return selected


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Legacy helper — returns user only when email+password match."""
    stmt = (
        select(User)
        .where(User.email == email)
        .options(selectinload(User.roles), selectinload(User.tenant))
=======
def authenticate_user(db: Session, email: str, password: str) -> User | None:
    stmt = (
        select(User)
        .where(User.email == email)
        .options(selectinload(User.roles))
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    )
    user = db.scalars(stmt).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def find_user_by_email(db: Session, email: str) -> User | None:
<<<<<<< HEAD
    return db.scalars(
        select(User)
        .where(User.email == email)
        .options(selectinload(User.roles), selectinload(User.tenant))
    ).first()


def login_user(db: Session, email: str, password: str) -> User:
    """
    Validate login with explicit error messages.
    JWT must only be issued by the caller after this succeeds.
    """
    from app.core.company_email import (
        MSG_ACCOUNT_DEACTIVATED,
        MSG_COMPANY_INACTIVE,
        MSG_EMAIL_NOT_FOUND,
        MSG_EMAIL_NOT_WITH_COMPANY,
        MSG_INCORRECT_PASSWORD,
        MSG_TRIAL_EXPIRED,
        email_domain,
        find_company_by_email_domain,
        is_subscription_active,
    )

    email = (email or "").strip().lower()
    user = find_user_by_email(db, email)

    if not user:
        domain = email_domain(email)
        company = find_company_by_email_domain(db, domain)
        if company:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=MSG_EMAIL_NOT_WITH_COMPANY,
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=MSG_EMAIL_NOT_FOUND,
        )

    company = user.tenant
    if company is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=MSG_EMAIL_NOT_FOUND,
        )

    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=MSG_INCORRECT_PASSWORD,
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=MSG_ACCOUNT_DEACTIVATED,
        )

    if not getattr(user, "email_verified", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email address before signing in.",
        )

    if not is_subscription_active(company):
        sub = (company.subscription or "trial").strip().lower()
        status_val = (getattr(company, "status", None) or "active").strip().lower()
        if status_val == "suspended":
            from app.core.company_email import MSG_COMPANY_SUSPENDED
            detail = MSG_COMPANY_SUSPENDED
        else:
            detail = MSG_TRIAL_EXPIRED if sub in {"trial", "expired", ""} else MSG_COMPANY_INACTIVE
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

    return user
=======
    return db.scalars(select(User).where(User.email == email)).first()
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8


def issue_auth_response_data(
    db: Session,
    user: User,
    *,
    ip_address: str | None = None,
    user_agent: str | None = None,
<<<<<<< HEAD
    role_name: str | None = None,
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
) -> dict:
    from app.services.security_service import clear_login_failures, create_refresh_token

    clear_login_failures(db, user)
<<<<<<< HEAD
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user, ["roles", "tenant"])
    access = build_access_token_for_user(user, role_name=role_name)
    refresh = create_refresh_token(db, user, ip_address=ip_address, user_agent=user_agent)
    user_data = get_user_with_role(db, user, preferred_role=role_name)
=======
    access = create_access_token({"sub": str(user.id), "email": user.email})
    refresh = create_refresh_token(db, user, ip_address=ip_address, user_agent=user_agent)
    user_data = get_user_with_role(db, user)
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer",
        "user": user_data,
    }


<<<<<<< HEAD
def get_user_with_role(db: Session, user: User, *, preferred_role: str | None = None) -> dict:
    from app.models.platform import CompanyLicense

    db.refresh(user, ["roles", "tenant"])
    role_names = [r.name for r in user.roles]
    permissions = sorted({p for r in user.roles for p in (r.permissions or [])})
    primary = None
    if preferred_role:
        primary = next((r for r in user.roles if r.name == preferred_role), None)
    if primary is None:
        primary = user.roles[0] if user.roles else None
    role_name = primary.name if primary else "Operator"
    tenant = user.tenant
    tenant_name = tenant.name if tenant else None

    license_row = None
    if tenant:
        license_row = db.scalars(
            select(CompanyLicense).where(CompanyLicense.tenant_id == tenant.id)
        ).first()

    company_code = None
    if tenant:
        company_code = getattr(tenant, "company_code", None) or f"GNS-{tenant.id:05d}"

=======
def get_user_with_role(db: Session, user: User) -> dict:
    db.refresh(user, ["roles", "tenant"])
    role_names = [r.name for r in user.roles]
    permissions = sorted({p for r in user.roles for p in (r.permissions or [])})
    role_name = role_names[0] if role_names else "Operator"
    tenant_name = user.tenant.name if user.tenant else None
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
<<<<<<< HEAD
        "phone": getattr(user, "phone", None),
        "employee_id": getattr(user, "employee_id", None),
        "designation": getattr(user, "designation", None),
        "tenant_id": user.tenant_id,
        "company_id": user.tenant_id,
        "company_code": company_code,
        "company_name": tenant_name,
        "tenant_name": tenant_name,
        "role_id": primary.id if primary else None,
        "role": role_name,
        "role_name": role_name,
        "roles": role_names,
        "permissions": permissions,
        "status": "active" if user.is_active else "inactive",
        "email_verified": bool(getattr(user, "email_verified", True)),
        "plant_code": getattr(user, "plant_code", None),
        "department": getattr(user, "department", None),
        "assigned_machine_id": getattr(user, "assigned_machine_id", None),
        "subscription_plan": license_row.plan if license_row else (tenant.subscription if tenant else None),
        "license_status": getattr(tenant, "license_status", None) if tenant else None,
        "trial_expires_at": tenant.trial_expires_at.isoformat() if tenant and getattr(tenant, "trial_expires_at", None) else None,
        "last_login_at": user.last_login_at.isoformat() if getattr(user, "last_login_at", None) else None,
        "current_login_at": datetime.now(timezone.utc).isoformat(),
    }


def find_user_by_name_and_email(db: Session, full_name: str, email: str) -> User | None:
    """Match registration identity by full name AND company email together."""
    normalized_name = (full_name or "").strip()
    normalized_email = (email or "").strip().lower()
    if not normalized_name or not normalized_email:
        return None
    return db.scalars(
        select(User).where(
            func.lower(User.full_name) == normalized_name.lower(),
            func.lower(User.email) == normalized_email,
        )
    ).first()


=======
        "tenant_id": user.tenant_id,
        "tenant_name": tenant_name,
        "role": role_name,
        "roles": role_names,
        "permissions": permissions,
        "plant_code": getattr(user, "plant_code", None),
        "department": getattr(user, "department", None),
        "assigned_machine_id": getattr(user, "assigned_machine_id", None),
    }


>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
def register_user(
    db: Session,
    company_name: str,
    full_name: str,
    email: str,
    password: str,
<<<<<<< HEAD
    role_name: str = "Admin",
) -> User:
    if role_name not in REGISTERABLE_ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Choose one of: {', '.join(REGISTERABLE_ROLES)}",
        )

    from app.core.company_email import (
        MSG_DUPLICATE_REGISTRATION,
        MSG_PUBLIC_EMAIL,
        email_domain,
        is_public_email_domain,
    )

    domain = email_domain(email)
    if is_public_email_domain(domain):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=MSG_PUBLIC_EMAIL,
        )

    normalized_name = full_name.strip()
    normalized_email = email.strip().lower()

    existing = find_user_by_name_and_email(db, normalized_name, normalized_email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=MSG_DUPLICATE_REGISTRATION,
=======
    role: str = "Admin",
) -> User:
    existing = db.scalars(select(User).where(User.email == email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        )

    base_name = company_name.strip()[:255]
    slug_base = _slugify(company_name)
    display_name = base_name
    slug = slug_base
    n = 0
    while True:
        name_taken = db.scalars(select(Tenant).where(Tenant.name == display_name)).first()
        slug_taken = db.scalars(select(Tenant).where(Tenant.slug == slug)).first()
        if not name_taken and not slug_taken:
            break
        n += 1
        slug = f"{slug_base}-{n}"
        display_name = f"{base_name} ({n})"[:255]

    try:
<<<<<<< HEAD
        tenant = Tenant(
            name=display_name,
            slug=slug,
            email=normalized_email,
            subscription="trial",
            trial_status=True,
        )
=======
        tenant = Tenant(name=display_name, slug=slug)
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        db.add(tenant)
        db.flush()

        seed_roles_for_tenant(db, tenant.id)
<<<<<<< HEAD
        assigned_role = db.scalars(
            select(Role).where(Role.tenant_id == tenant.id, Role.name == role_name)
        ).first()
        if not assigned_role:
            raise HTTPException(status_code=500, detail=f"Failed to provision role: {role_name}")

        user = User(
            tenant_id=tenant.id,
            email=normalized_email,
            full_name=normalized_name,
=======
        target_role = db.scalars(
            select(Role).where(Role.tenant_id == tenant.id, Role.name == role)
        ).first()
        if not target_role:
            target_role = db.scalars(
                select(Role).where(Role.tenant_id == tenant.id, Role.name == "Admin")
            ).first()
        if not target_role:
            raise HTTPException(status_code=500, detail="Failed to provision administrator role")

        user = User(
            tenant_id=tenant.id,
            email=email,
            full_name=full_name,
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
            hashed_password=hash_password(password),
            is_active=not _settings.email_verification_required,
            email_verified=not _settings.email_verification_required,
        )
        db.add(user)
<<<<<<< HEAD
        db.flush()
        db.execute(
            user_roles.insert().values(user_id=user.id, role_id=assigned_role.id)
        )
=======
        user.roles.append(target_role)
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
<<<<<<< HEAD
            detail="Could not create company account. Please try again.",
=======
            detail="Could not create company account. Try a different company or email.",
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        )
