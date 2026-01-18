def test_register(client):
    response = client.post(
        "/auth/register",
        json={"first_name": "new", "last_name": "user", "email": "test@example.com", "password": "Password1"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"



def test_register_invalid_password(client):
    response = client.post(
        "/auth/register",
        json={"email": "test2@example.com", "password": "short"}
    )
    assert response.status_code == 422


def test_login(client):
    # D'abord, créer un utilisateur
    client.post(
        "/auth/register",
        json={"first_name": "new", "last_name": "user", "email": "login@example.com", "password": "Password1"}
    )

    # Ensuite, tester login
    response = client.post(
        "/auth/login",
        data={"username": "login@example.com", "password": "Password1"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"



# def test_protected_route(client):
#     # Créer et login pour obtenir token
#     client.post("/auth/register", json={"email": "secure@example.com", "password": "Password1"})
#     login_response = client.post("/auth/login", data={"username": "secure@example.com", "password": "Password1"})
#     token = login_response.json()["access_token"]

#     # Appeler route protégée
#     response = client.get(
#         "/protected",
#         headers={"Authorization": f"Bearer {token}"}
#     )
#     assert response.status_code == 200
#     assert "token" in response.json()