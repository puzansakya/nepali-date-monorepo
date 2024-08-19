import { useDatePickerStore, selectCtx, selectEvents } from 'nepali-react-datepicker';
import { Button } from './controller';

export const Today = () => {

    const state = useDatePickerStore()

    const { isTodayValid } = selectCtx(state)
    const { selectToday } = selectEvents(state)

    return <div className='flex w-full items-center justify-center'>
        <Button disabled={!isTodayValid} onClick={selectToday}>
            Today
        </Button>
    </div>
}
