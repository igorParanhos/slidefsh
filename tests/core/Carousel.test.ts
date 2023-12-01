import { Carousel } from '../../src/core/Carousel';

describe('Carousel', () => {
    it('should be defined', () => {
        const carousel = new Carousel();
        expect(Carousel).toBeDefined();
    });
});