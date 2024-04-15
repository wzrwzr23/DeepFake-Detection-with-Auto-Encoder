from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from detect_from_video import test_full_image_network

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mkv', 'mov'}  # Add more if needed
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Receive selected models
    selected_models = request.form.getlist('selectedModels')
    print("Selected Models:", selected_models)

    if file and allowed_file(file.filename):
        # Create directory if it doesn't exist
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({'success': True, 'message': 'File uploaded successfully'})
    else:
        return jsonify({'error': 'File type not allowed'})


if __name__ == '__main__':
    app.run(debug=True)

video_path = None
model_path = None
if video_path.endswith('.mp4') or video_path.endswith('.avi'):
    percent = test_full_image_network(video_path, model_path)
else:
    print("Unsupported video format.")

