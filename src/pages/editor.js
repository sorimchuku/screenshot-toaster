import dynamic from 'next/dynamic';
import TopBar from '../components/TopBar';
const Canvas = dynamic(() => import('../components/Canvas/Canvas'), {
  ssr: false,
});

export default function EditorPage() {
    return (
        <div className='h-screen'>
          <TopBar />
            <Canvas />
            <style jsx global>{`
        body {
          padding: 0;
          margin: 0;
        }
      `}</style>
        </div>
    );
}
