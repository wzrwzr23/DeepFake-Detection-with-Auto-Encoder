from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import subprocess

# Full path to the ffmpeg executable
FFMPEG_PATH = '/usr/local/bin/ffmpeg'

def generate_snapshot(video_path):
    snapshot_path = os.path.join(app.config['SNAPSHOT_FOLDER'], f"{os.path.splitext(os.path.basename(video_path))[0]}.jpg")
    subprocess.run([FFMPEG_PATH, '-i', video_path, '-ss', '00:00:01', '-vframes', '1', snapshot_path])
    return snapshot_path

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi'}  # Add more if needed
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
SNAPSHOT_FOLDER = 'snapshots'
app.config['SNAPSHOT_FOLDER'] = SNAPSHOT_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_snapshot(video_path):
    snapshot_path = os.path.join(app.config['SNAPSHOT_FOLDER'], f"{os.path.splitext(os.path.basename(video_path))[0]}.jpg")
    subprocess.run(['ffmpeg', '-i', video_path, '-ss', '00:00:01', '-vframes', '1', snapshot_path])
    return snapshot_path

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file and allowed_file(file.filename):
        # Create directory if it doesn't exist
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Generate snapshot
        snapshot_path = generate_snapshot(filepath)

        return jsonify({'success': True, 'message': 'File uploaded successfully', 'snapshot_url': f"/{snapshot_path}"})
    else:
        return jsonify({'error': 'File type not allowed'})

if __name__ == '__main__':
    app.run(debug=True)
