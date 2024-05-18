'use client';

import React, { useEffect } from 'react';

import {
    Button, Navbar,
    Alignment, } from '@blueprintjs/core';

import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { setHighlighterStyle, setTransformerStyle } from 'polotno/config';

import '@blueprintjs/core/lib/css/blueprint.css';

import { createStore } from 'polotno/model/store';
import Link from 'next/link';
import styled from 'polotno/utils/styled';

const store = createStore({
    key: 'g_b-afGM_OzJ3Q340skW', // you can create it here: https://polotno.com/cabinet/
    // you can hide back-link on a paid license
    // but it will be good if you can keep it for Polotno project support
    showCredit: true,
});
const page = store.addPage();
store.setSize(1080, 1920);

const NavbarContainer = styled('div')`
  white-space: nowrap;
  height: 64px;

  @media screen and (max-width: 500px) {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100vw;
  }
`;

const NavInner = styled('div')`
  @media screen and (max-width: 500px) {
    display: flex;
  }
`;

const Topbar = ({ store }) => {
    return (
        <NavbarContainer className="bp5-navbar px-8 content-center">
            <NavInner>
                <Navbar.Group align={Alignment.LEFT}>
                    <Link href='/' className='text-4xl font-bold'>shottoaster</Link>
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>
                    <Button
                        onClick={() => {
                        }}
                        minimal large
                    >
                        기종 변경
                    </Button>
                    <Button
                        onClick={() => {
                            store.saveAsImage({ pixelRatio: 0.2 });
                        }}
                        intent='primary'
                    >
                        저장
                    </Button>
                </Navbar.Group>
            </NavInner>
        </NavbarContainer>
    );
};


export const Editor = () => {
    setTransformerStyle({
        anchorStroke: 'green',
        anchorStrokeWidth: '1',
        borderStroke: 'green',
        borderStrokeWidth: '1'
    });
    setHighlighterStyle({
        stroke: 'green',
        strokeWidth: '1',
    });

    return (
        <div className='h-screen w-full flex-col'>
            <Topbar store={store}></Topbar>
            <PolotnoContainer style={{height: 'calc(100vh - 64px'}}>
                <SidePanelWrap>
                    <SidePanel store={store} />
                </SidePanelWrap>
                <WorkspaceWrap>
                    <Toolbar store={store} />
                    <Workspace
                    store={store}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        overflowX: 'scroll',
                    }}
                    />
                    <ZoomButtons store={store} />
                </WorkspaceWrap>
            </PolotnoContainer>
    </div>
        
    );
};

export default Editor;

