import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('../components/Editor'), {
    ssr: false,
});
const SimpleEditor = dynamic(() => import('../components/simpleEditor'), {
  ssr: false,
});
const Canvas = dynamic(() => import('../components/Canvas'), {
  ssr: false,
});

export default function EditorPage() {
    return (
        <div>
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
