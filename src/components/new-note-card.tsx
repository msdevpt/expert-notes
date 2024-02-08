import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react'
import { useState } from 'react';
import { toast } from 'sonner'

export function NewNoteCard() {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
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

      console.log(content);

      toast.success('Event has been created')
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
            <Dialog.Content className='fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none'>
              <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                <X className='size-5' />
              </Dialog.Close>

              <form 
                onSubmit={handleSaveNote}
                className='flex-1 flex flex-col'
              >

                <div className='flex flex-1 flex-col gap-3 p-5'>
                  <span className='text-sm font-medium text-slate-200'>
                    Add Note
                  </span>
                  {shouldShowOnboarding ? (
                    <p className='text-sm leading-6 text-slate-400'>
                      Start recording a <button className='font-medium text-lime-400 hover:underline'>audio note</button> or if you prefer use <button onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>text</button> only
                    </p>
                  ): (
                    <textarea 
                      name="text"
                      id="text" 
                      autoFocus
                      onChange={handleContentChange}
                      className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none' 
                    />
                  )}
                </div>

                <button
                  type='submit'
                  className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
                >
                  Save note
                </button>

              </form>
            </Dialog.Content>
        </Dialog.Portal>

      </Dialog.Root>
    )
}