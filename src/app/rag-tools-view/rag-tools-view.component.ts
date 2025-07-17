import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {SelectedView} from "../shared/components/list-select-view/interfaces/list-select-view.interface"
import {ElectronService, SendMessageActionType} from "../shared/services/electron/electron.service";
import {RAGSection} from "../shared/interfaces/rag-tools.interface";
import {tap} from "rxjs";
import {Store} from "@ngrx/store";
import {coreFeature} from "../store/core/core.reducer";
@Component({
  selector: 'rag-tools-view',
  templateUrl: './rag-tools-view.component.html',
  styleUrls: ['./rag-tools-view.component.scss']
})
export class RagToolsViewComponent implements OnInit{
  electronService = inject(ElectronService);
  store = inject(Store)
  sections: RAGSection[] = []
  sectionsList:string[] = []
  currentSection: RAGSection | null = null
  currentIndex:number|null = null
  currentHoveredFile:string|null = null

  ngOnInit() {
    this.store.select(coreFeature.selectRagTools).pipe().subscribe(ragTools => {
      this.sections = [...ragTools]
    })
    this.updateSectionsList()
  }
  updateSectionsList(){
    this.sectionsList = this.sections.map(section => section.section_name)
  }

  changeCurrentSection(selectedView:SelectedView) {
   this.currentIndex = selectedView.index
   if(selectedView.index==this.sections.length){
     const newSection:RAGSection = {
       section_name:selectedView.name,
       prompt:"",
       paths:[]
     }
      this.sections = [...this.sections,newSection]
    }
    this.currentSection = JSON.parse(JSON.stringify(this.sections[selectedView.index])) as RAGSection
  }
  addFiles() {
    this.electronService.selectFile().subscribe(attachedFiles => { console.log('attached files:', attachedFiles);
      for (const Path of attachedFiles) {
        console.log('attached file:', Path);
        this.currentSection?.paths.push(Path)}
    })


  }
  removeFile(index: number) {
    this.currentSection!.paths.splice(index, 1);
  }
  saveCurrentSection() {
    this.sections[this.currentIndex!] = JSON.parse(JSON.stringify(this.currentSection)) as RAGSection
    this.updateSectionsList()
    this.electronService.sendDataToBackend(
      JSON.stringify(this.sections),
      SendMessageActionType.SAVE_RAG_TOOLS
    );
  }

  getShortenedPath(path:string){
    return path.split('\\').pop()
  }

}


