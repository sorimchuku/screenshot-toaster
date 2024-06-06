import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('../components/Canvas/Editor'), {
  ssr: false,
});

export default function EditorPage() {
    return (
        <div className='h-screen'>
            <Editor />
        </div>
    );
}
