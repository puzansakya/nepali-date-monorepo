export const useFlexGridMaker = () => {

    /**
     * 1 = 4px
     */
    const GUTTER_WIDTH = 2;
    const NO_OF_COLUMNS = 3;
    const ROW_NEGATIVE_MARGIN = Math.abs(GUTTER_WIDTH) * -1 || -4;
    const EACH_COL_WIDTH = `${100 / NO_OF_COLUMNS}%`;

    return {
        ROW_NEGATIVE_MARGIN,
        EACH_COL_WIDTH,
        GUTTER_WIDTH,
    }
}
