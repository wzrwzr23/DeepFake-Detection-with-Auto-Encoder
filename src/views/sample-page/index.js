import UnityComponent from 'views/dashboard/Default/unity';
import VideoStreamCanvas from 'views/dashboard/Default/video';
// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
  <div>
    {/* <VideoStreamCanvas streamUrl='https://capstoneserver.azurewebsites.net/frame' /> */}
    <UnityComponent />
  </div>
);

export default SamplePage;