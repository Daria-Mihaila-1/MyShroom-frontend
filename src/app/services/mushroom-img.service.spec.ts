import { TestBed } from '@angular/core/testing';

import { MushroomImgService } from './mushroom-img.service';

describe('MushroomImgService', () => {
  let service: MushroomImgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MushroomImgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
