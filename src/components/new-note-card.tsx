import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react'
import { useState } from 'react';
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [content, setContent] = useState('');

    function handleStartEditor() {
      setShouldShowOnboarding(false);
    }

    function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
      setContent(event.target.value);

      if (event.target.value === '')
        setShouldShowOnboarding(true);
    }

    function handleSaveNote(event: React.FormEvent) {
      event.preventDefault();

      onNoteCreated(content);

      setContent('');
      setShouldShowOnboarding(true);

      toast.success('Note has been created');
    }

    let  speechRecognitionAPI: SpeechRecognition | null = null;

    function handleStartRecording() {
      const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window 
        || 'webkitSpeechRecognition' in window 

      if (!isSpeechRecognitionAPIAvailable) {
        alert("Browser don't support this feature.");
        return;
      }
      setIsRecording(true);
      setShouldShowOnboarding(false);

      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognitionAPI = new SpeechRecognitionAPI();

      speechRecognitionAPI.continuous = true;
      speechRecognitionAPI.interimResults = true;
      speechRecognitionAPI.maxAlternatives = 1;

      speechRecognitionAPI.onresult = (event) => {
        const transcription = Array.from(event.results).reduce((text, result) => {
          return text.concat(result[0].transcript)
        }, '');

        setContent(transcription);
      }

      speechRecognitionAPI.onerror = (event) => {
        console.error(event);
      }

      speechRecognitionAPI.start();
      
    }

    function handleStopRecording() {
      setIsRecording(false);

      if (speechRecognitionAPI !== null)
        speechRecognitionAPI.stop();
    }

    return (
      <Dialog.Root>
        <Dialog.Trigger className='rounded-md flex flex-col text-left bg-slate-700 p-5 gap-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
          <span className='text-sm font-medium text-slate-200'>
            New note
          </span>
          <p className='text-sm leading-6 text-slate-400'>
            Record a audio note that will be converted to text automatically
          </p>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
            <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
              <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                <X className='size-5' />
              </Dialog.Close>

              <form 
                className='flex-1 flex flex-col'
              >

                <div className='flex flex-1 flex-col gap-3 p-5'>
                  <span className='text-sm font-medium text-slate-200'>
                    Add Note
                  </span>
                  {shouldShowOnboarding ? (
                    <p className='text-sm leading-6 text-slate-400'>
                      Start recording a <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>audio note</button> or if you prefer use <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>text</button> only
                    </p>
                  ): (
                    <textarea 
                      name="text"
                      id="text" 
                      autoFocus
                      onChange={handleContentChange}
                      value={content}
                      className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none' 
                    />
                  )}
                </div>

                { isRecording ? (
                  <button
                    type='button'
                    onClick={handleStopRecording}
                    className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:bg-slate-100'
                  >
                    <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                    Recording! (Click to stop)
                  </button>  
                ): (
                  <button
                    type='button'
                    disabled={content === ''}
                    onClick={handleSaveNote}
                    className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500 disabled:pointer-events-none'
                  >
                    Save note
                  </button>
                )}


              </form>
            </Dialog.Content>
        </Dialog.Portal>

      </Dialog.Root>
    )
}