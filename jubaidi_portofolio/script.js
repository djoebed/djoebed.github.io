function login() {
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (!username || !password) {
        alert("Masukin dulu user name dan passwordnya dong!!");
        return false; // Prevent form submission
    }

    // Redirect to the main page if both fields are filled
    window.location.href = 'Main page/Djoebed_portofolio.html';
    return false; // Prevent traditional form submission
}