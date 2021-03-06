/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestBed, ComponentFixture} from '@angular/core/testing';

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {BreakPointsProvider} from '../../media-query/providers/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {FlexLayoutModule} from '../_module';

import {customMatchers, expect} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent,
  makeExpectDOMForQuery,
  queryFor
} from '../../utils/testing/helpers';

describe('layout-gap directive', () => {
  let createTestComponent = makeCreateTestComponent(() => TestLayoutGapComponent);
  let expectDomForQuery = makeExpectDOMForQuery(() => TestLayoutGapComponent);

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule.forRoot()],
      declarations: [TestLayoutGapComponent],
      providers: [
        BreakPointRegistry, BreakPointsProvider,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  describe('with static features', () => {

    it('should not add gap styles for a single child', () => {
      let template = `
              <div fxLayoutAlign="center center" fxLayoutGap="13px">
                  <div fxFlex></div>
              </div>
          `;
      expectDomForQuery(template, "[fxFlex]").not.toHaveCssStyle({
        'margin-left': '13px;',
      });
    });

    it('should add gap styles to all children except the 1st child', () => {
      let template = `
              <div fxLayoutAlign="center center" fxLayoutGap="13px">
                  <div fxFlex></div>
                  <div fxFlex></div>
                  <div fxFlex></div>
              </div>
          `;
      let fixture = createTestComponent(template); // tslint:disable-line:no-shadowed-variable
      fixture.detectChanges();

      let nodes = queryFor(fixture, "[fxFlex]");
      expect(nodes.length).toEqual(3);
      expect(nodes[0].nativeElement).not.toHaveCssStyle({'margin-left': '13px'});
      expect(nodes[1].nativeElement).toHaveCssStyle({'margin-left': '13px'});
      expect(nodes[2].nativeElement).toHaveCssStyle({'margin-left': '13px'});
    });

    it('should apply margin-top for column layouts', () => {
      verifyCorrectMargin('column', 'margin-top');
    });

    it('should apply margin-right for row-reverse layouts', () => {
      verifyCorrectMargin('row-reverse', 'margin-right');
    });

    it('should apply margin-bottom for column-reverse layouts', () => {
      verifyCorrectMargin('column-reverse', 'margin-bottom');
    });

    it('should remove obsolete margin and apply valid margin for layout changes', () => {
      let fixture: ComponentFixture<any> = createTestComponent(`
          <div [fxLayout]="direction" [fxLayoutGap]="gap">
              <span></span>
              <span></span>
          </div>
      `);
      let instance = fixture.componentInstance;

      // layout = column, use margin-top
      instance.direction = "column";
      instance.gap = "8px";
      fixture.detectChanges();
      let nodes = queryFor(fixture, 'span');

      expect(nodes[1].nativeElement).not.toHaveCssStyle({'margin-left': '8px'});
      expect(nodes[1].nativeElement).toHaveCssStyle({'margin-top': '8px'});


      // layout = column-reverse, use margin-bottom
      instance.direction = "column-reverse";
      fixture.detectChanges();
      nodes = queryFor(fixture, 'span');

      expect(nodes[1].nativeElement).not.toHaveCssStyle({'margin-top': '8px'});
      expect(nodes[1].nativeElement).toHaveCssStyle({'margin-bottom': '8px'});


      // layout = row-reverse, use margin-right
      instance.direction = "row-reverse";
      fixture.detectChanges();
      nodes = queryFor(fixture, 'span');

      expect(nodes[1].nativeElement).not.toHaveCssStyle({'margin-bottom': '8px'});
      expect(nodes[1].nativeElement).toHaveCssStyle({'margin-right': '8px'});
    });
  });

  function verifyCorrectMargin(layout: string, marginKey: string) {
    const margin = '8px';
    const template = `
            <div fxLayout='${layout}' fxLayoutGap='${margin}'>
                <span></span>
                <span></span>
            </div>
        `;

    const fixture = createTestComponent(template);
    fixture.detectChanges();

    const nodes = queryFor(fixture, 'span');
    expect(nodes[1].nativeElement).toHaveCssStyle({[marginKey]: margin});
  }

  describe('with responsive features', () => {


  });

});


// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-layout',
  template: `<span>PlaceHolder Template HTML</span>`
})
export class TestLayoutGapComponent implements OnInit {
  direction = "column";
  gap = "8px";

  constructor() {
  }

  ngOnInit() {
  }
}


