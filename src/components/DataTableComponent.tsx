import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import type { PaginatorPageChangeEvent } from 'primereact/paginator';
import { Checkbox } from 'primereact/checkbox';
import type { CheckboxChangeEvent } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import type { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { ChevronDownIcon } from '@primereact/icons/chevrondown';
import axios from 'axios';

interface Artwork {
  id: number;
  title: string;
  artist_title: string;
  date_display: string;
  thumbnail: {
    lqip: string;
    alt_text?: string;
  };
}

interface ApiResponse {
  data: Artwork[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
}

const DataTableComponent: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<Set<number>>(new Set());
  const [numRowsToSelect, setNumRowsToSelect] = useState<number | null>(null);
  const op = useRef<OverlayPanel>(null);

  const fetchArtworks = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        `https://api.artic.edu/api/v1/artworks`,
        {
          params: {
            page,
            limit: pageSize,
            fields: 'id,title,artist_title,date_display,thumbnail'
          }
        }
      );

      setArtworks(response.data.data);
      setTotalRecords(response.data.pagination.total);
      
      const currentPageSelected = response.data.data.filter(artwork => 
        selectedArtworkIds.has(artwork.id)
      );
      setSelectedArtworks(currentPageSelected);
      setSelectAll(currentPageSelected.length === response.data.data.length);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(1, rows);
  }, []);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
    const page = Math.floor(event.first / event.rows) + 1;
    fetchArtworks(page, event.rows);
  };

  const onSelectionChange = (e: { value: Artwork[] }) => {
    const newSelectedArtworks = e.value;
    setSelectedArtworks(newSelectedArtworks);
    setSelectAll(newSelectedArtworks.length === artworks.length);

    const newSelectedIds = new Set(selectedArtworkIds);
    artworks.forEach(artwork => {
      if (newSelectedArtworks.some(a => a.id === artwork.id)) {
        newSelectedIds.add(artwork.id);
      } else {
        newSelectedIds.delete(artwork.id);
      }
    });
    setSelectedArtworkIds(newSelectedIds);
  };

  const onSelectAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.checked as boolean;
    setSelectAll(checked);

    const newSelectedIds = new Set(selectedArtworkIds);
    if (checked) {
      artworks.forEach(artwork => newSelectedIds.add(artwork.id));
      setSelectedArtworks([...artworks]);
    } else {
      artworks.forEach(artwork => newSelectedIds.delete(artwork.id));
      setSelectedArtworks([]);
    }
    setSelectedArtworkIds(newSelectedIds);
  };

  const handleNumRowsSelect = () => {
    if (numRowsToSelect !== null && numRowsToSelect > 0) {
      const numToSelect = Math.min(numRowsToSelect, artworks.length);
      const newSelected = artworks.slice(0, numToSelect);
      setSelectedArtworks(newSelected);
      setSelectAll(numToSelect === artworks.length);
      
      const newSelectedIds = new Set(selectedArtworkIds);
      artworks.forEach((artwork, index) => {
        if (index < numToSelect) {
          newSelectedIds.add(artwork.id);
        } else {
          newSelectedIds.delete(artwork.id);
        }
      });
      setSelectedArtworkIds(newSelectedIds);
    }
    op.current?.hide();
  };

  const toggleOverlay = (event: React.MouseEvent) => {
    op.current?.toggle(event);
  };

  const handleSubmit = () => {
    alert(`Submitted ${selectedArtworks.length} selected artworks`);
    console.log('Selected Artworks:', selectedArtworks);
  };

  const imageBodyTemplate = (rowData: Artwork) => {
    return (
      <div className="flex align-items-center gap-2">
        <img 
          src={rowData.thumbnail?.lqip} 
          alt={rowData.thumbnail?.alt_text || rowData.title}
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
        <span>{rowData.id}</span>
      </div>
    );
  };

  const titleBodyTemplate = (rowData: Artwork) => {
    return (
      <div className="flex flex-column">
        <span className="font-bold">{rowData.title}</span>
        <span className="text-sm">{rowData.artist_title}</span>
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Artwork) => {
    return (
      <div className="flex flex-column">
        <span>{rowData.date_display}</span>
      </div>
    );
  };

  const headerTemplate = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h2>Art Institute of Chicago Collection</h2>
        <div className="flex align-items-center gap-2">
          <Button 
            label="Select artworks..." 
            icon={<ChevronDownIcon />}
            iconPos="right"
            onClick={toggleOverlay}
            className="p-button-text"
          />
          <OverlayPanel ref={op} dismissable>
            <div className="p-fluid" style={{ width: '250px' }}>
              <div className="field">
                <label htmlFor="numRows">Number of artworks to select</label>
                <InputNumber 
                  id="numRows" 
                  value={numRowsToSelect} 
                  onValueChange={(e: InputNumberValueChangeEvent) => {
                    setNumRowsToSelect(e.value === undefined ? null : e.value);
                  }}
                  min={1}
                  showButtons
                  placeholder="Enter number"
                />
              </div>
              <Button 
                label="Apply" 
                onClick={handleNumRowsSelect}
                className="p-button-sm w-full"
              />
            </div>
          </OverlayPanel>
          {selectedArtworks.length > 0 && (
            <Button 
              label={`Submit (${selectedArtworks.length})`}
              onClick={handleSubmit}
              className="p-button-raised p-button-success"
            />
          )}
        </div>
      </div>
    );
  };

  const selectionPanelTemplate = () => {
    return (
      <div className="p-3 surface-100 border-round mb-3">
        <div className="flex align-items-center gap-2 mb-2">
          <Checkbox 
            onChange={onSelectAllChange} 
            checked={selectAll} 
          />
          <span>Select All ({selectedArtworks.length} selected)</span>
        </div>
        <div className="selected-items-grid">
          {selectedArtworks.map(artwork => (
            <div key={artwork.id} className="p-2 border-round surface-50 mb-2 flex align-items-center gap-2">
              <img 
                src={artwork.thumbnail?.lqip} 
                alt={artwork.thumbnail?.alt_text || artwork.title}
                style={{ width: '30px', height: '30px', objectFit: 'cover' }}
              />
              <div className="flex flex-column">
                <span className="font-bold">{artwork.title}</span>
                <span className="text-sm">{artwork.artist_title}</span>
                <span className="text-sm">{artwork.date_display}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="card p-4">
      <DataTable
        value={artworks}
        loading={loading}
        header={headerTemplate()}
        selection={selectedArtworks}
        onSelectionChange={onSelectionChange}
        dataKey="id"
        selectionMode="multiple"
        responsiveLayout="scroll"
        paginator={false}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column header="ID & Image" body={imageBodyTemplate} />
        <Column header="Title & Artist" body={titleBodyTemplate} />
        <Column header="Date" body={dateBodyTemplate} />
      </DataTable>

      {selectionPanelTemplate()}

      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        rowsPerPageOptions={[10, 25, 50]}
      />
    </div>
  );
};

export default DataTableComponent;