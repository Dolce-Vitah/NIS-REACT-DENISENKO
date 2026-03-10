import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Menu, MenuItem, Tooltip } from '@mui/material';

type ExportMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  labels: {
    filteredCsv: string;
    dashboardJson: string;
    pngImage: string;
    pdfViaPrint: string;
  };
  tooltips: {
    csv: string;
    json: string;
    png: string;
    pdf: string;
  };
  onExportCsv: () => void;
  onExportConfig: () => void;
  onExportPng: () => void;
  onExportPdf: () => void;
};

export function ExportMenu({
  anchorEl,
  open,
  onClose,
  labels,
  tooltips,
  onExportCsv,
  onExportConfig,
  onExportPng,
  onExportPdf,
}: ExportMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Tooltip title={tooltips.csv}>
        <MenuItem
          onClick={() => {
            onClose();
            onExportCsv();
          }}
        >
          <FileDownloadOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          {labels.filteredCsv}
        </MenuItem>
      </Tooltip>
      <Tooltip title={tooltips.json}>
        <MenuItem
          onClick={() => {
            onClose();
            onExportConfig();
          }}
        >
          <SaveOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          {labels.dashboardJson}
        </MenuItem>
      </Tooltip>
      <Tooltip title={tooltips.png}>
        <MenuItem
          onClick={() => {
            onClose();
            onExportPng();
          }}
        >
          <ImageOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          {labels.pngImage}
        </MenuItem>
      </Tooltip>
      <Tooltip title={tooltips.pdf}>
        <MenuItem
          onClick={() => {
            onClose();
            onExportPdf();
          }}
        >
          <PictureAsPdfOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          {labels.pdfViaPrint}
        </MenuItem>
      </Tooltip>
    </Menu>
  );
}
