from website import create_app

app = create_app() # Deployment on PythonAnywhere needs 'app' object before 'main.py' is ran

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)