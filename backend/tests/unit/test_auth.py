def test_register(client):
    response = client.post(
        "/auth/register",
        json={"first_name": "new", "last_name": "user", "email": "test@example.com", "password": "Password1"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "first_name" in data
    assert "last_name" in data
    assert data["role"] == "USER"



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
        json={"email": "login@example.com", "password": "Password1"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "first_name" in data
    assert "last_name" in data
    assert data["role"] == "USER"
